import { Handler } from 'express';
import { Client } from 'openid-client';
import { getLogger } from '../logger';
import { getSessionIdAndSignature, setSessionCookie } from './session-utils';
import { getAccessTokenWithRefresh } from './tokens';

const log = getLogger('auth');

export const guardMiddleware =
  (authClient: Client): Handler =>
  async (req, res, next) => {
    const session = getSessionIdAndSignature(req);

    if (session === null) {
      res.status(401).send();

      return;
    }

    const [sessionId, signature] = session;

    setSessionCookie(res, sessionId, signature); // Refresh the current session cookie on every request.

    try {
      const access_token = await getAccessTokenWithRefresh(authClient, sessionId);
      req.headers['Authorization'] = access_token; // Misuse the Authorization header to not query Redis twice for the same data for the same request.
      next();
    } catch (error) {
      log.warn({ error });
      res.status(401).send();
    }
  };
