import express from 'express';
import { Client } from 'openid-client';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { applicationDomain, isDeployedToProd } from '../config/env';
import { getOnBehalfOfAccessToken } from '../auth/azure/on-behalf-of';
import { generateSessionIdAndSignature, getSessionIdAndSignature, setSessionCookie } from '../auth/session-utils';
import { loginRedirect } from '../auth/login-redirect';

const router = express.Router();

export const setupProxy = (authClient: Client) => {
  router.use('/api', async (req, res, next) => {
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
      const obo_access_token = await getOnBehalfOfAccessToken(authClient, access_token);
      req.headers['Authorization'] = `Bearer ${obo_access_token}`;
      next();
      return;
    } catch (error) {
      console.warn(`Failed to prepare request with on-behalf-of token. ${error}`);
      loginRedirect(authClient, sessionId, res, req.originalUrl);
      return;
    }
  });

  const headers = isDeployedToProd
    ? undefined
    : {
        origin: applicationDomain,
      };

  router.use(
    '/api',
    createProxyMiddleware({
      target: 'http://kabal-api',
      pathRewrite: {
        '^/api': '',
      },
      headers,
      onError: (err, req, res) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.write(
          JSON.stringify({
            error: `Failed to connect to API. Reason: ${err}`,
          })
        );
        res.end();
      },
      logLevel: 'error',
      changeOrigin: true,
    })
  );

  return router;
};
