import { Handler } from 'express';
import { Client } from 'openid-client';
import { loginRedirect } from './login-redirect';
import { generateSessionIdAndSignature, getSessionIdAndSignature, setSessionCookie } from './session-utils';
import { getAccessTokenWithRefresh } from './tokens';

export const authMiddleware =
  (authClient: Client): Handler =>
  async (req, res, next) => {
    const session = getSessionIdAndSignature(req);
    if (session === null) {
      console.debug(`Auth middleware - session is null. Redirecting to login. - ${req.originalUrl}`);
      const [sessionId, signature] = generateSessionIdAndSignature();
      setSessionCookie(res, sessionId, signature);
      loginRedirect(authClient, sessionId, req, res);
      return;
    }

    console.debug(`Auth middleware - session is valid. - ${req.originalUrl}`);

    const [sessionId, signature] = session;

    console.debug(`Refreshing session cookie. - ${req.originalUrl}`);
    setSessionCookie(res, sessionId, signature); // Refresh the current session cookie on every request.

    try {
      console.debug(`Auth middleware - Getting access token from Redis for session ${sessionId}. - ${req.originalUrl}`);
      const access_token = await getAccessTokenWithRefresh(authClient, sessionId);
      req.headers['Authorization'] = access_token;
      next();
    } catch (error) {
      console.debug(
        `Auth middleware - Failed to get access token from Redis for session ${sessionId}. - ${req.originalUrl} - ${error}`
      );
      if (error instanceof Error || typeof error === 'string') {
        console.warn(error);
      }
      loginRedirect(authClient, sessionId, req, res);
      return;
    }
  };
