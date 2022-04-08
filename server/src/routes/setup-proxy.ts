import express, { Router } from 'express';
import { Client } from 'openid-client';
import { Server } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getOnBehalfOfAccessToken } from '../auth/azure/on-behalf-of';
import { generateSessionIdAndSignature, getSessionIdAndSignature, setSessionCookie } from '../auth/session-utils';
import { loginRedirect } from '../auth/login-redirect';
import { API_CLIENT_IDS } from '../config/config';

export const setupProxy = (authClient: Client, server: Server) => {
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
        console.warn(`Failed to prepare request with on-behalf-of token. ${error}`);
        loginRedirect(authClient, sessionId, res, req.originalUrl);
        return;
      }
    });

    setProxyMiddleware(route, router, appName, true, server);
    setProxyMiddleware(route, router, appName, false, server);
  });

  return router;
};

const setProxyMiddleware = (route: string, router: Router, appName: string, ws: boolean, server: Server) => {
  const proxy = createProxyMiddleware({
    target: `${ws ? 'ws' : 'http'}://${appName}`,
    pathRewrite: {
      [`^/api/${appName}`]: '',
    },
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
    logLevel: ws ? 'debug' : 'warn',
    changeOrigin: true,
    ws,
  });

  router.use(route, proxy);

  if (typeof proxy.upgrade !== 'undefined') {
    server.on('upgrade', proxy.upgrade);
  }
};
