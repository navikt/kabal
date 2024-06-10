import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getAzureADClient } from '@app/auth/get-auth-client';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import { API_CLIENT_IDS } from '@app/config/config';
import { getLogger } from '@app/logger';
import { ensureTraceparent } from '@app/request-id';
import { DEV_URL, isDeployed } from '@app/config/env';

const log = getLogger('proxy');

const router = Router();

export const setupProxy = () => {
  API_CLIENT_IDS.forEach((appName) => {
    const route = `/api/${appName}`;

    if (isDeployed) {
      router.use(route, async (req, _, next) => {
        const authHeader = req.header('Authorization');
        const traceId = ensureTraceparent(req);

        if (typeof authHeader === 'string') {
          try {
            const authClient = await getAzureADClient();
            const obo_access_token = await getOnBehalfOfAccessToken(authClient, authHeader, appName, traceId);
            req.headers['authorization'] = `Bearer ${obo_access_token}`;
            req.headers['azure-ad-token'] = authHeader;
          } catch (error) {
            log.warn({ msg: `Failed to prepare request with OBO token.`, error, traceId, data: { route } });
          }
        }

        next();
      });
    }

    const target = isDeployed ? `http://${appName}` : DEV_URL;

    interface PathRewriteMap {
      [regexp: string]: string;
    }

    type PathRewriteFn = (path: string, req: IncomingMessage) => Promise<string>;

    const pathRewrite: PathRewriteMap | PathRewriteFn | undefined = isDeployed
      ? { [`^/api/${appName}/`]: '/' }
      : async (path: string) => `/api/${appName}${path}`;

    router.use(
      route,
      createProxyMiddleware({
        target,
        pathRewrite,
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
              data: { proxy_target_application: appName, url, method },
            });

            const onClose = (msg: string) => {
              const duration = Math.round(performance.now() - start);

              log.debug({ msg, traceId, data: { proxy_target_application: appName, url, method, duration } });

              proxyReq.destroy();
              res.destroy();
            };

            res.once('close', () => {
              onClose('Proxy connection closed');
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
                data: { proxy_target_application: appName, url, method },
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
              data: { proxy_target_application: appName, url, method },
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
