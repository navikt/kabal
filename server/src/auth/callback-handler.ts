import { Handler } from 'express';
import { Client } from 'openid-client';
import { callbackUrl } from '../config/azure-config';
import { getLogger } from '../logger';
import { getSessionData, saveSessionData } from '../redis';
import { loginRedirect } from './login-redirect';
import { ensureSession } from './session-utils';

const log = getLogger('auth');

export const callbackHandler =
  (authClient: Client): Handler =>
  async (req, res) => {
    const { code, error, error_description } = authClient.callbackParams(req);
    const [sessionId] = ensureSession(req, res);

    if (typeof error === 'string' || typeof error_description === 'string') {
      log.warn({ msg: 'Callback handler error', error });
      loginRedirect(authClient, sessionId, res, req.originalUrl);

      return;
    }

    if (typeof code !== 'string') {
      const err = `No code in query after Azure login. Session '${sessionId}'.`;
      log.warn({ msg: 'Callback handler error', error: err });
      res.status(500).send(err);

      return;
    }

    if (typeof authClient.issuer.metadata.token_endpoint !== 'string') {
      const err = 'OpenID issuer misconfigured. Missing token endpoint.';
      log.warn({ msg: 'Callback handler error', error: err });
      res.status(500).send(err);

      return;
    }

    const sessionData = await getSessionData(sessionId);

    if (sessionData === null) {
      const err = `No session data found after Azure login. Session '${sessionId}'.`;
      log.warn({ msg: 'Callback handler error', error: err });
      res.status(500).send(err);

      return;
    }

    const { before_login, code_verifier } = sessionData;

    if (typeof code_verifier !== 'string') {
      const err = `OpenID code verifier missing in session data. Session '${sessionId}'.`;
      log.warn({ msg: 'Callback handler error', error: err });
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
    } catch (err) {
      log.error({ msg: `Callback handler: Error while exchanging code for tokens.`, error: err });

      loginRedirect(authClient, sessionId, res, before_login ?? '/');
    }
  };
