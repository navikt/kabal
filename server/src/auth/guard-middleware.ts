import { Handler } from 'express';
import { Client } from 'openid-client';
import { getSessionIdAndSignature, setSessionCookie } from './session-utils';
import { getAccessTokenWithRefresh } from './tokens';

export const guardMiddleware =
  (authClient: Client): Handler =>
  async (req, res, next) => {
    const session = getSessionIdAndSignature(req);
    if (session === null) {
      res.status(403).send();
      return;
    }

    const [sessionId, signature] = session;

    setSessionCookie(res, sessionId, signature); // Refresh the current session cookie on every request.

    try {
      const access_token = await getAccessTokenWithRefresh(authClient, sessionId);
      req.headers['Authorization'] = access_token;
      next();
    } catch (error) {
      if (error instanceof Error || typeof error === 'string') {
        console.warn(error);
      }
      res.status(403).send();
      return;
    }
  };
