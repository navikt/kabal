import type { Client, GrantBody } from 'openid-client';
import { getCacheKey, oboCache } from '@/auth/cache/cache';
import { AZURE_APP_CLIENT_ID, NAIS_CLUSTER_NAME } from '@/config/config';
import { parseTokenPayload } from '@/helpers/token-parser';
import { withSpan } from '@/helpers/tracing';
import { getLogger } from '@/logger';

const log = getLogger('obo-token');

export const getOnBehalfOfAccessToken = async (
  authClient: Client,
  accessToken: string,
  navIdent: string,
  appName: string,
): Promise<string> => {
  const cacheKey = getCacheKey(navIdent, appName);
  const token = await oboCache.get(cacheKey);

  if (token === null) {
    return refreshOnBehalfOfAccessToken(authClient, accessToken, cacheKey, appName);
  }

  const parsed = parseTokenPayload(token);

  if (parsed === undefined) {
    return refreshOnBehalfOfAccessToken(authClient, accessToken, cacheKey, appName);
  }

  const now = Math.ceil(Date.now() / 1_000);

  if (parsed.exp < now) {
    return refreshOnBehalfOfAccessToken(authClient, accessToken, cacheKey, appName);
  }

  if (parsed.exp - now < 30) {
    log.debug({ msg: `Refreshing OBO token for ${appName}`, data: { navIdent, appName } });

    refreshOnBehalfOfAccessToken(authClient, accessToken, cacheKey, appName).catch((error) => {
      log.error({ msg: 'Failed to refresh OBO token', error, data: { navIdent, appName } });
    });
  }

  return token;
};

export const refreshOnBehalfOfAccessToken = async (
  authClient: Client,
  accessToken: string,
  cacheKey: string,
  appName: string,
): Promise<string> => {
  const scope = `api://${NAIS_CLUSTER_NAME}.klage.${appName}/.default`;

  return withSpan('auth.obo_grant', { app_name: appName, scope }, async () => {
    if (typeof authClient.issuer.metadata.token_endpoint !== 'string') {
      const error = new Error('OpenID issuer misconfigured. Missing token endpoint.');
      log.error({ msg: 'On-Behalf-Of error', error });
      throw error;
    }

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
        await oboCache.set(cacheKey, obo_access_token, expires_at);
      }

      return obo_access_token;
    } catch (error) {
      log.error({ msg: 'On-Behalf-Of error', error });

      throw error;
    }
  });
};
