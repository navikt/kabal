import { BaseClient, Issuer } from 'openid-client';
import { AZURE_APP_CLIENT_ID, AZURE_APP_JWK, AZURE_APP_WELL_KNOWN_URL } from '@app/config/config';
import { getLogger } from '@app/logger';
import { isLocal } from '@app/config/env';

const log = getLogger('auth-client');

let azureADClient: BaseClient | null = null;

export const getAzureADClient = async () => {
  if (azureADClient !== null) {
    return azureADClient;
  }

  try {
    const issuer = await Issuer.discover(AZURE_APP_WELL_KNOWN_URL);

    const keys = [AZURE_APP_JWK];

    azureADClient = new issuer.Client(
      {
        client_id: AZURE_APP_CLIENT_ID,
        token_endpoint_auth_method: 'private_key_jwt',
        token_endpoint_auth_signing_alg: 'RS256',
      },
      { keys },
    );

    return azureADClient;
  } catch (error) {
    log.error({ msg: 'Failed to get Azure AD client', error });
    throw error;
  }
};

export const getIsAzureClientReady = () => isLocal || azureADClient !== null;
