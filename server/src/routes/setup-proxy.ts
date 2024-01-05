import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getAzureADClient } from '@app/auth/get-auth-client';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import { API_CLIENT_IDS } from '@app/config/config';
import { getLogger } from '@app/logger';
import { ensureTraceparent } from '@app/request-id';

const log = getLogger('proxy');

export const setupProxy = async () => {
  const authClient = await getAzureADClient();
  const router = Router();

  API_CLIENT_IDS.forEach((appName) => {
    const route = `/api/${appName}`;

    router.use(route, async (req, res, next) => {
      const authHeader = req.header('Authorization');
      const traceId = ensureTraceparent(req);

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
        onProxyReq: (proxyRes, req, res) => {
          if (req.headers.accept !== 'text/event-stream') {
            return;
          }

          const { url, originalUrl, method } = req;
          const traceId = ensureTraceparent(req);

          const onEnd = (msg: string) => (error: Error | undefined) => {
            log.debug({
              msg,
              error,
              traceId,
              data: { proxy_target_application, url, originalUrl, method },
            });

            proxyRes.end();
            res.end();
          };

          proxyRes.once('close', onEnd('Proxy connection closed by target'));
          res.on('close', onEnd('Proxy connection closed'));
        },
        onError: (error, req, res) => {
          const { url, originalUrl, method } = req;
          const traceId = ensureTraceparent(req);

          if (res.headersSent) {
            log.error({
              msg: 'Headers already sent.',
              error,
              traceId,
              data: {
                appName,
                statusCode: res.statusCode,
                url,
                originalUrl,
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
            data: { proxy_target_application, url, originalUrl, method },
          });
        },
        logLevel: 'warn',
        changeOrigin: true,
      }),
    );
  });

  return router;
};
