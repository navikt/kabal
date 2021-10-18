import { Handler } from 'express';
import { Client } from 'openid-client';
import { loginRedirect } from './login-redirect';
import { generateSessionIdAndSignature, getSessionIdAndSignature, setSessionCookie } from './session-utils';
import { getAccessTokenWithRefresh } from './tokens';

export const authMiddleware =
  (authClient: Client): Handler =>
  async (req, res, next) => {
    console.log('Auth middleware:', req.path, req.query);
    const session = getSessionIdAndSignature(req);
    if (session === null) {
      const [sessionId, signature] = generateSessionIdAndSignature();
      setSessionCookie(res, sessionId, signature);
      loginRedirect(authClient, sessionId, res, req.originalUrl);
      return;
    }

    const [sessionId, signature] = session;

    setSessionCookie(res, sessionId, signature); // Refresh the current session cookie on every request.

    try {
      const internalAccessToken = req.headers['Authorization'];
      const access_token =
        typeof internalAccessToken === 'string'
          ? internalAccessToken
          : await getAccessTokenWithRefresh(authClient, sessionId);
      req.headers['Authorization'] = access_token;
      next();
    } catch (error) {
      if (error instanceof Error || typeof error === 'string') {
        console.warn('Auth middleware:', error);
      }
      loginRedirect(authClient, sessionId, res, req.originalUrl);
      return;
    }
  };
