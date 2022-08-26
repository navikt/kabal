import { Issuer } from 'openid-client';
import { AZURE_APP_CLIENT_ID, AZURE_APP_JWK, AZURE_APP_WELL_KNOWN_URL } from '../config/config';
import { getLogger } from '../logger';

const log = getLogger('auth');

export const getAzureADClient = async () => {
  try {
    const issuer = await Issuer.discover(AZURE_APP_WELL_KNOWN_URL);

    const keys = [AZURE_APP_JWK];

    return new issuer.Client(
      {
        client_id: AZURE_APP_CLIENT_ID,
        token_endpoint_auth_method: 'private_key_jwt',
        token_endpoint_auth_signing_alg: 'RS256',
      },
      { keys }
    );
  } catch (error) {
    log.error({ msg: 'Failed to get Azure AD client', error });
    throw error;
  }
};
