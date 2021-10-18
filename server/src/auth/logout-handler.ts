import { Handler } from 'express';
import { Client } from 'openid-client';
import { deleteFromRedis } from '../redis';
import { loginRedirect } from './login-redirect';
import { generateSessionIdAndSignature, getSessionIdAndSignature, setSessionCookie } from './session-utils';

export const logoutHandler =
  (authClient: Client): Handler =>
  async (req, res) => {
    const session = getSessionIdAndSignature(req);

    if (session !== null) {
      const [sessionId] = session;
      await deleteFromRedis(sessionId);
    }

    const [sessionId, signature] = generateSessionIdAndSignature();
    setSessionCookie(res, sessionId, signature);

    const redirect = req.headers.referer ?? '/';
    loginRedirect(authClient, sessionId, res, redirect);
  };
