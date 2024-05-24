import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Client } from 'openid-client';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import { API_CLIENT_IDS } from '@app/config/config';
import { getLogger } from '@app/logger';
import { ensureTraceparent } from '@app/request-id';

const log = getLogger('proxy');

export const setupProxy = async (authClient: Client) => {
  const router = Router();

  API_CLIENT_IDS.forEach((appName) => {
    const route = `/api/${appName}`;

    router.use(route, async (req, res, next) => {
      const traceId = ensureTraceparent(req);
      const authHeader = req.header('Authorization');

      if (typeof authHeader === 'string') {
        try {
          const obo_access_token = await getOnBehalfOfAccessToken(authClient, authHeader, appName, traceId);
          req.headers['authorization'] = `Bearer ${obo_access_token}`;
          req.headers['azure-ad-token'] = authHeader;
        } catch (error) {
          log.warn({ msg: `Failed to prepare request with OBO token.`, error, traceId, data: { route } });
        }
      }

      next();
    });

    const proxy_target_application = appName;

    router.use(
      route,
      createProxyMiddleware({
        target: `http://${appName}`,
        pathRewrite: {
          [`^/api/${appName}`]: '',
        },
        on: {
          proxyReq: (proxyReq, req, res) => {
            if (req.headers.accept !== 'text/event-stream') {
              return;
            }

            const { url, method } = req;
            const traceId = ensureTraceparent(req);
            const start = performance.now();

            log.debug({
              msg: 'Proxying SSE connection',
              traceId,
              data: { proxy_target_application, url, method },
            });

            let closedByTarget = false;
            let closedByClient = false;

            const onClose = (msg: string) => {
              const duration = Math.round(performance.now() - start);

              log.debug({ msg, traceId, data: { proxy_target_application, url, method, duration } });

              proxyReq.destroy();
              res.destroy();
            };

            proxyReq.once('close', () => {
              closedByTarget = true;
              onClose('Proxy connection closed by target' + (closedByClient ? ', already closed by client' : ''));
            });
            res.once('close', () => {
              closedByClient = true;
              onClose('Proxy connection closed' + (closedByTarget ? ', already closed by target' : ''));
            });
          },
          error: (error, req, res) => {
            const { url, method } = req;
            const traceId = ensureTraceparent(req);

            if (!isServerResponse(res)) {
              log.error({
                msg: 'Server response is not a ServerResponse.',
                error,
                traceId,
                data: { proxy_target_application, url, method },
              });

              return;
            }

            if (res.headersSent) {
              log.error({
                msg: 'Headers already sent.',
                error,
                traceId,
                data: {
                  appName,
                  statusCode: res.statusCode,
                  url,
                  method,
                },
              });

              return;
            }

            res.writeHead(500, { 'Content-Type': 'application/json' });
            const body = JSON.stringify({ error: `Failed to connect to API. Reason: ${error.message}` });
            res.end(body);
            log.error({
              msg: 'Failed to connect to API.',
              error,
              traceId,
              data: { proxy_target_application, url, method },
            });
          },
        },
        changeOrigin: true,
      }),
    );
  });

  return router;
};

const isServerResponse = (res: ServerResponse<IncomingMessage> | Socket): res is ServerResponse<IncomingMessage> =>
  'headersSent' in res &&
  typeof res.headersSent === 'boolean' &&
  'writeHead' in res &&
  typeof res.writeHead === 'function' &&
  'end' in res &&
  typeof res.end === 'function';
