import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Client } from 'openid-client';
import { getOnBehalfOfAccessToken } from '../auth/azure/on-behalf-of';
import { loginRedirect } from '../auth/login-redirect';
import { generateSessionIdAndSignature, getSessionIdAndSignature, setSessionCookie } from '../auth/session-utils';
import { API_CLIENT_IDS } from '../config/config';
import { getLogger } from '../logger';

const log = getLogger('proxy');

export const setupProxy = (authClient: Client) => {
  const router = express.Router();

  API_CLIENT_IDS.forEach((appName) => {
    const route = `/api/${appName}`;

    router.use(route, async (req, res, next) => {
      const session = getSessionIdAndSignature(req);

      if (session === null) {
        const [sessionId, signature] = generateSessionIdAndSignature();
        setSessionCookie(res, sessionId, signature);
        loginRedirect(authClient, sessionId, res, req.originalUrl);

        return;
      }

      const [sessionId] = session;
      const access_token = req.headers['Authorization'];

      if (typeof access_token !== 'string') {
        loginRedirect(authClient, sessionId, res, req.originalUrl);

        return;
      }

      try {
        const obo_access_token = await getOnBehalfOfAccessToken(authClient, access_token, appName);
        req.headers['Authorization'] = `Bearer ${obo_access_token}`;
        next();

        return;
      } catch (error) {
        log.warn({ msg: `Failed to prepare request with on-behalf-of token` });
        loginRedirect(authClient, sessionId, res, req.originalUrl);
      }
    });

    router.use(
      route,
      createProxyMiddleware({
        target: `http://${appName}`,
        pathRewrite: {
          [`^/api/${appName}`]: '',
        },
        onError: (error, req, res) => {
          if (res.headersSent) {
            log.error({
              msg: 'Headers already sent.',
              error,
              data: {
                appName,
                statusCode: res.statusCode,
                url: req.originalUrl,
                method: req.method,
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
            data: { appName, url: req.originalUrl, method: req.method },
          });
        },
        logLevel: 'warn',
        logProvider: () => ({
          log: (msg: string) => log.info({ msg, data: { appName } }),
          info: (msg: string) => log.info({ msg, data: { appName } }),
          debug: (msg: string) => log.debug({ msg, data: { appName } }),
          warn: (msg: string) => log.warn({ msg, data: { appName } }),
          error: (msg: string) => log.error({ msg, data: { appName } }),
        }),
        changeOrigin: true,
      })
    );
  });

  return router;
};
