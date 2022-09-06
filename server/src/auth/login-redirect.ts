import { Response } from 'express';
import { Client, generators } from 'openid-client';
import { azureAdAuthParams } from '../config/azure-config';
import { getLogger } from '../logger';
import { saveSessionData } from '../redis';

const log = getLogger('auth');

export const loginRedirect = async (authClient: Client, session: string, res: Response, before_login: string) => {
  try {
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    const authUrl = authClient.authorizationUrl({ ...azureAdAuthParams, code_challenge });
    await saveSessionData(session, { before_login, code_verifier });
    res.redirect(authUrl);
  } catch (error) {
    log.warn({ msg: 'Failed to redirect to login', error });
    throw error;
  }
};
