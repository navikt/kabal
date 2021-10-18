import { Handler } from 'express';
import { Client } from 'openid-client';
import { callbackUrl } from '../config/azure-config';
import { getSessionData, saveSessionData } from '../redis';
import { loginRedirect } from './login-redirect';
import { ensureSession } from './session-utils';

export const callbackHandler =
  (authClient: Client): Handler =>
  async (req, res) => {
    const { code, error, error_description } = authClient.callbackParams(req);
    const [sessionId] = ensureSession(req, res);

    if (typeof error === 'string' || typeof error_description === 'string') {
      console.warn('Callback handler:', error, error_description);
      loginRedirect(authClient, sessionId, res, req.originalUrl);
      return;
    }

    if (typeof code !== 'string') {
      const err = `No code in query after Azure login. Session '${sessionId}'.`;
      console.warn(err);
      res.status(500).send(err);
      return;
    }

    if (typeof authClient.issuer.metadata.token_endpoint !== 'string') {
      const err = 'OpenID issuer misconfigured. Missing token endpoint.';
      console.warn(err);
      res.status(500).send(err);
      return;
    }

    const sessionData = await getSessionData(sessionId);
    if (sessionData === null) {
      const err = `No session data found after Azure login. Session '${sessionId}'.`;
      console.warn(err);
      res.status(500).send(err);
      return;
    }

    const { before_login, code_verifier } = sessionData;

    if (typeof code_verifier !== 'string') {
      const err = `OpenID code verifier missing in session data. Session '${sessionId}'.`;
      console.warn(err);
      res.status(500).send(err);
      return;
    }

    try {
      const { access_token, refresh_token } = await authClient.callback(
        callbackUrl,
        { code },
        { code_verifier },
        {
          clientAssertionPayload: {
            aud: authClient.issuer.metadata.issuer,
          },
        }
      );

      await saveSessionData(sessionId, { access_token, refresh_token });

      res.redirect(before_login ?? '/');
    } catch (error) {
      if (error instanceof Error || typeof error === 'string') {
        console.error('Callback handler:', `Error while exchanging code for tokens.`, error);
      } else {
        console.error('Callback handler:', 'Unknown error while exchanging code for tokens.');
      }

      loginRedirect(authClient, sessionId, res, before_login ?? '/');
    }
  };
