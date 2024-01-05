import { Client, GrantBody } from 'openid-client';
import { AZURE_APP_CLIENT_ID, NAIS_CLUSTER_NAME } from '@app/config/config';
import { getLogger } from '@app/logger';
import { now, oboCache } from './on-behalf-of-cache';

const log = getLogger('auth');

export const getOnBehalfOfAccessToken = async (
  authClient: Client,
  authHeader: string,
  appName: string,
  traceId: string,
): Promise<string> => {
  const cacheKey = `${authHeader}-${appName}`;

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
    log.error({ msg: 'On-Behalf-Of error', error, traceId });
    throw error;
  }

  const scope = `api://${NAIS_CLUSTER_NAME}.klage.${appName}/.default`;

  try {
    const params: GrantBody = {
      client_id: AZURE_APP_CLIENT_ID,
      scope,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      requested_token_use: 'on_behalf_of',
      assertion: getSubjectAccessToken(authHeader),
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
    log.error({ msg: 'On-Behalf-Of error', error, traceId });

    throw error;
  }
};

const getSubjectAccessToken = (authHeader: string) => {
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    throw new Error('Error while splitting bearer token');
  }

  return parts[1];
};
