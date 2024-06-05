import { getAzureADClient } from '@app/auth/get-auth-client';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import { isDeployed } from '@app/config/env';
import { getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { MiddlewareHandler } from 'hono';
import { setMetric } from 'hono/timing';

const log = getLogger('obo-middleware');

type GetOboMiddleware = (appName: string, route: string) => MiddlewareHandler;

export const oboTokenMiddleware: GetOboMiddleware = (appName, route) => async (context, next) => {
  const { traceId, accessToken } = context.var;

  if (isDeployed && accessToken !== undefined) {
    try {
      const azureClientStart = performance.now();
      const authClient = await getAzureADClient();
      setMetric(context, 'obo_token_middleware', getDuration(azureClientStart), 'Azure Client Middleware');

      const oboStart = performance.now();
      const obo_access_token = await getOnBehalfOfAccessToken(authClient, accessToken, appName, traceId);
      setMetric(context, 'obo_token_middleware', getDuration(oboStart), 'OBO Token Middleware');

      context.set('oboAccessToken', obo_access_token);
    } catch (error) {
      log.warn({ msg: `Failed to prepare request with OBO token.`, error, traceId, data: { route } });
    }
  }

  return await next();
};
