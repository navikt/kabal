import { Handler } from 'express';
import { Client } from 'openid-client';
import { callbackUrl } from '../config/azure-config';
import { getSessionData, saveSessionData } from '../redis';
import { loginRedirect } from './login-redirect';
import { ensureSession } from './session-utils';

export const callbackHandler =
  (authClient: Client): Handler =>
  async (req, res) => {
    console.log('Callback handler', req.path, req.query);
    const { code, error, error_description } = authClient.callbackParams(req);
    const [sessionId] = ensureSession(req, res);

    if (typeof error === 'string' || typeof error_description === 'string') {
      console.warn(error, error_description);
      loginRedirect(authClient, sessionId, res, req.originalUrl);
      return;
    }

    if (typeof code !== 'string') {
      loginRedirect(authClient, sessionId, res, req.originalUrl);
      return;
    }

    if (typeof authClient.issuer.metadata.token_endpoint !== 'string') {
      res.status(500).send('OpenID issuer misconfigured. Missing token endpoint.');
      return;
    }

    const { before_login, code_verifier } = await getSessionData(sessionId);

    if (typeof code_verifier !== 'string') {
      res.status(500).send('OpenID code verifier missing in session data. Cannot validate callback code.');
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
        console.error(`Error while exchanging code for tokens.`, error);
      } else {
        console.error('Unknown error while exchanging code for tokens.');
      }

      loginRedirect(authClient, sessionId, res, before_login ?? '/');
    }
  };
