import { Client, GrantBody } from 'openid-client';
import { client_id } from '../../config/azure-config';
import { KABAL_API_CLIENT_ID } from '../../config/config';

const scope = `api://${KABAL_API_CLIENT_ID}/.default`;

export const getOnBehalfOfAccessToken = async (authClient: Client, access_token: string): Promise<string> => {
  if (typeof authClient.issuer.metadata.token_endpoint !== 'string') {
    const error = new Error(`OpenID issuer misconfigured. Missing token endpoint.`);
    console.error(error);
    throw error;
  }

  try {
    const params: GrantBody = {
      client_id,
      scope,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      requested_token_use: 'on_behalf_of',
      assertion: access_token,
    };

    const { access_token: obo_access_token } = await authClient.grant(params, {
      clientAssertionPayload: {
        aud: authClient.issuer.metadata.token_endpoint,
      },
    });

    if (typeof obo_access_token !== 'string') {
      throw new Error('No on-behalf-of access token from Azure.');
    }

    return obo_access_token;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw error;
    }

    if (typeof error === 'string') {
      throw new Error(error);
    }

    throw new Error('Unknown error while getting on-behalf-of access token.');
  }
};
