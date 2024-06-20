import { FastifyReply, FastifyRequest } from 'fastify';
import { getAzureADClient } from '@app/auth/get-auth-client';
import { getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('obo-token-plugin');

declare module 'fastify' {
  export interface FastifyRequest {
    oboAccessToken: string;
  }
}

export interface OboTokenPluginOptions {
  appNames: string[];
}

export const oboAccessTokenPlugin = fastifyPlugin<OboTokenPluginOptions>(
  (app, { appNames }, pluginDone) => {
    app.decorateRequest('oboAccessToken', '');

    app.addHook('preHandler', async (req, reply) => {
      const { url, accessToken } = req;

      if (accessToken === undefined || accessToken.length === 0) {
        return;
      }

      const appName = appNames.find((name) => url.startsWith(`/api/${name}`));

      if (appName === undefined) {
        return;
      }

      const oboAccessToken = await getOboToken(appName, req, reply);

      if (oboAccessToken !== undefined) {
        req.oboAccessToken = oboAccessToken;
      }
    });

    pluginDone();
  },
  { fastify: '4', name: 'obo-access-token', dependencies: ['access-token', 'server-timing'] },
);

type GetOboToken = (appName: string, req: FastifyRequest, reply: FastifyReply) => Promise<string | undefined>;

const getOboToken: GetOboToken = async (appName, req, reply) => {
  const { traceId, accessToken } = req;

  if (accessToken !== undefined) {
    try {
      const azureClientStart = performance.now();
      const authClient = await getAzureADClient();
      reply.addServerTiming('azure_client_middleware', getDuration(azureClientStart), 'Azure Client Middleware');

      const oboStart = performance.now();
      const obo_access_token = await getOnBehalfOfAccessToken(authClient, accessToken, appName, traceId);
      reply.addServerTiming('obo_token_middleware', getDuration(oboStart), 'OBO Token Middleware');

      return obo_access_token;
    } catch (error) {
      log.warn({ msg: `Failed to prepare request with OBO token.`, error, traceId, data: { route: req.url } });
    }
  }

  return undefined;
};
