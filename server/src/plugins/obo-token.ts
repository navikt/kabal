import { FastifyReply, FastifyRequest } from 'fastify';
import { getAzureADClient } from '@app/auth/get-auth-client';
import { getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import fastifyPlugin from 'fastify-plugin';
import { isDeployed } from '@app/config/env';
import { oboRequestDuration } from '@app/auth/cache/cache-gauge';

const log = getLogger('obo-token-plugin');

const oboAccessTokenMapKey = Symbol('oboAccessTokenMap');

declare module 'fastify' {
  interface FastifyRequest {
    [oboAccessTokenMapKey]: Map<string, string>;
    ensureOboAccessToken(appName: string, reply: FastifyReply): Promise<string | undefined>;
    getOboAccessToken(appName: string): string | undefined;
  }
}

const NOOP = async () => undefined;

export const oboAccessTokenPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.decorateRequest(oboAccessTokenMapKey, null);

    app.addHook('onRequest', async (req): Promise<void> => {
      req[oboAccessTokenMapKey] = new Map();
    });

    if (isDeployed) {
      app.decorateRequest('ensureOboAccessToken', async function (appName: string, reply: FastifyReply) {
        const oboAccessToken = await getOboToken(appName, this, reply);

        if (oboAccessToken !== undefined) {
          log.debug({ msg: `Adding OBO token for "${appName}". Had ${this[oboAccessTokenMapKey].size} before.` });
          this[oboAccessTokenMapKey].set(appName, oboAccessToken);
        }

        return oboAccessToken;
      });
    } else {
      app.decorateRequest('ensureOboAccessToken', NOOP);
    }

    app.decorateRequest('getOboAccessToken', function (appName: string) {
      log.debug({ msg: `Getting OBO token for "${appName}". Has ${this[oboAccessTokenMapKey].size} tokens.` });

      return this[oboAccessTokenMapKey].get(appName);
    });

    pluginDone();
  },
  { fastify: '4', name: 'obo-access-token', dependencies: ['access-token', 'server-timing'] },
);

type GetOboToken = (appName: string, req: FastifyRequest, reply: FastifyReply) => Promise<string | undefined>;

const getOboToken: GetOboToken = async (appName, req, reply) => {
  const { trace_id, span_id, accessToken } = req;
  const signature = accessToken.split('.').at(2);

  if (accessToken !== undefined && signature !== undefined) {
    try {
      const azureClientStart = performance.now();
      const authClient = await getAzureADClient();
      reply.addServerTiming('azure_client_middleware', getDuration(azureClientStart), 'Azure Client Middleware');

      const oboStart = performance.now();
      const oboAccessToken = await getOnBehalfOfAccessToken(
        authClient,
        accessToken,
        signature,
        appName,
        trace_id,
        span_id,
      );

      const duration = getDuration(oboStart);
      oboRequestDuration.observe(duration);
      reply.addServerTiming('obo_token_middleware', duration, 'OBO Token Middleware');

      return oboAccessToken;
    } catch (error) {
      log.warn({
        msg: `Failed to prepare request with OBO token.`,
        error,
        trace_id,
        span_id,
        data: { route: req.url },
      });
    }
  }

  return undefined;
};
