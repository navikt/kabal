import { Client, GrantBody } from 'openid-client';
import { AZURE_APP_CLIENT_ID, NAIS_CLUSTER_NAME } from '@app/config/config';
import { getLogger } from '@app/logger';
import { oboCache } from '@app/auth/cache';

const log = getLogger('obo-token');

export const getOnBehalfOfAccessToken = async (
  authClient: Client,
  accessToken: string,
  signature: string,
  appName: string,
  trace_id: string,
  span_id: string,
): Promise<string> => {
  const cacheKey = `${signature}-${appName}`;
  const token = await oboCache.get(cacheKey);

  if (token !== null) {
    return token;
  }

  if (typeof authClient.issuer.metadata.token_endpoint !== 'string') {
    const error = new Error(`OpenID issuer misconfigured. Missing token endpoint.`);
    log.error({ msg: 'On-Behalf-Of error', error, trace_id, span_id });
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
      assertion: accessToken,
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
      oboCache.set(cacheKey, obo_access_token, expires_at);
    }

    return obo_access_token;
  } catch (error) {
    log.error({ msg: 'On-Behalf-Of error', error, trace_id, span_id });

    throw error;
  }
};
