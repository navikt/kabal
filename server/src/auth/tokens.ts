import { JWK, JWT, errors } from 'jose';
import { Client } from 'openid-client';
import { azureClientMetadata, client_id } from '../config/azure-config';
import { deleteFromRedis, getSessionData } from '../redis';
import { refreshAndSaveTokens } from './azure/refresh-tokens';

export const getAccessTokenWithRefresh = async (authClient: Client, sessionId: string): Promise<string> => {
  const sessionData = await getSessionData(sessionId);

  if (sessionData === null) {
    throw new Error(`No session data for session '${sessionId}'.`);
  }

  const { access_token: session_access_token, refresh_token: session_refresh_token } = sessionData;

  if (typeof session_access_token !== 'string') {
    throw new Error(`No access token for session '${sessionId}'.`);
  }

  try {
    await verifyToken(authClient, session_access_token);

    return session_access_token;
  } catch (verifyError) {
    if (verifyError instanceof errors.JWTExpired && typeof session_refresh_token === 'string') {
      return await refreshAndSaveTokens(authClient, sessionId, session_refresh_token);
    }

    await deleteFromRedis(sessionId);

    if (verifyError instanceof Error) {
      throw verifyError;
    }

    if (typeof verifyError === 'string') {
      throw new Error(verifyError);
    }

    throw new Error('Unknown error while getting and verifying access token.');
  }
};

const verifyToken = async (authClient: Client, access_token: string): Promise<JWK.Key> => {
  const keyStore = await authClient.issuer.keystore();

  const valid = JWT.verify(access_token, keyStore, {
    issuer: authClient.issuer.metadata.issuer,
    algorithms: [azureClientMetadata.token_endpoint_auth_signing_alg],
    audience: client_id,
    complete: true,
  });

  return valid.key;
};
