import { FastifyReply, FastifyRequest } from 'fastify';
import { getAzureADClient } from '@app/auth/get-auth-client';
import { getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import fastifyPlugin from 'fastify-plugin';
import { isDeployed } from '@app/config/env';

const log = getLogger('obo-token-plugin');

export const oboAccessTokenMapKey = Symbol('oboAccessTokenMap');

declare module 'fastify' {
  interface FastifyRequest {
    [oboAccessTokenMapKey]: Map<string, string>;
    ensureOboAccessToken(appName: string, reply: FastifyReply): Promise<void>;
    getOboAccessToken(appName: string): string | undefined;
  }
}

const NOOP = async () => {
  // No operation.
};

export const oboAccessTokenPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.decorateRequest(oboAccessTokenMapKey, null);

    app.addHook('onRequest', async (req): Promise<void> => {
      req[oboAccessTokenMapKey] = new Map();
    });

    if (isDeployed) {
      app.decorateRequest('ensureOboAccessToken', async function (appName: string, reply: FastifyReply) {
        await ensureOboToken(appName, this, reply);
      });
    } else {
      app.decorateRequest('ensureOboAccessToken', NOOP);
    }

    app.decorateRequest('getOboAccessToken', function (appName: string) {
      return this[oboAccessTokenMapKey].get(appName);
    });

    pluginDone();
  },
  { fastify: '4', name: 'obo-access-token', dependencies: ['access-token', 'server-timing'] },
);

const ensureOboToken = async (appName: string, req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const oboAccessToken = await getOboToken(appName, req, reply);

  if (oboAccessToken !== undefined) {
    req[oboAccessTokenMapKey].set(appName, oboAccessToken);
  }
};

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
