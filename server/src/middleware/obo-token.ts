import { getAzureADClient } from '@app/auth/get-auth-client';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import { getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { FastifyReply, FastifyRequest } from 'fastify';

const log = getLogger('obo-middleware');

type GetOboMiddleware = (appName: string) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;

export const getOboTokenMiddleware: GetOboMiddleware = (appName) => async (req, reply) => {
  const { traceId, accessToken } = req;

  if (accessToken !== undefined) {
    try {
      const azureClientStart = performance.now();
      const authClient = await getAzureADClient();
      reply.addServerTiming('azure_client_middleware', getDuration(azureClientStart), 'Azure Client Middleware');

      const oboStart = performance.now();
      const obo_access_token = await getOnBehalfOfAccessToken(authClient, accessToken, appName, traceId);
      reply.addServerTiming('obo_token_middleware', getDuration(oboStart), 'OBO Token Middleware');

      req.oboAccessToken = obo_access_token;
    } catch (error) {
      log.warn({ msg: `Failed to prepare request with OBO token.`, error, traceId, data: { route: req.url } });
    }
  }
};
