import { Client, GrantBody } from 'openid-client';
import { client_id } from '../../config/azure-config';
import { serverConfig } from '../../config/server-config';
import { now, oboCache } from './on-behalf-of-cache';

export const getOnBehalfOfAccessToken = async (
  authClient: Client,
  access_token: string,
  appName: string
): Promise<string> => {
  const scope = `api://${serverConfig.cluster}.klage.${appName}/.default`;
  const cacheKey = `${access_token}-${appName}`;

  const cacheHit = oboCache.get(cacheKey);
  if (typeof cacheHit !== 'undefined') {
    const [cached_obo_access_token, expires_at] = cacheHit;

    if (expires_at > now()) {
      return cached_obo_access_token;
    }

    oboCache.delete(cacheKey);
  }

  if (typeof authClient.issuer.metadata.token_endpoint !== 'string') {
    const error = new Error(`OpenID issuer misconfigured. Missing token endpoint.`);
    console.error('On-Behalf-Of:', error);
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

    const { access_token: obo_access_token, expires_at } = await authClient.grant(params, {
      clientAssertionPayload: {
        aud: authClient.issuer.metadata.token_endpoint,
      },
    });

    if (typeof obo_access_token !== 'string') {
      throw new Error('No on-behalf-of access token from Azure.');
    }

    if (typeof expires_at === 'number') {
      oboCache.set(cacheKey, [obo_access_token, expires_at]);
    }

    return obo_access_token;
  } catch (error) {
    if (error instanceof Error) {
      console.error('On-Behalf-Of:', error);
      throw error;
    }

    if (typeof error === 'string') {
      throw new Error(error);
    }

    throw new Error('Unknown error while getting on-behalf-of access token.');
  }
};
