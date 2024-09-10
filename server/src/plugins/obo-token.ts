import { FastifyReply, FastifyRequest } from 'fastify';
import { getAzureADClient } from '@app/auth/get-auth-client';
import { getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import fastifyPlugin from 'fastify-plugin';
import { isDeployed } from '@app/config/env';
import { oboRequestDuration } from '@app/auth/cache/cache-gauge';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import { SERVER_TIMING_PLUGIN_ID } from '@app/plugins/server-timing';
import { NAV_IDENT_PLUGIN_ID } from '@app/plugins/nav-ident';

const log = getLogger('obo-token-plugin');

const OBO_ACCESS_TOKEN_MAP_KEY = Symbol('oboAccessTokenMapKey');

declare module 'fastify' {
  interface FastifyRequest {
    [OBO_ACCESS_TOKEN_MAP_KEY]: Map<string, string>;
    ensureOboAccessToken(appName: string, reply?: FastifyReply): Promise<string | undefined>;
    getOboAccessToken(appName: string): string | undefined;
  }
}

const NOOP = async () => undefined;

export const OBO_ACCESS_TOKEN_PLUGIN_ID = 'obo-access-token';

export const oboAccessTokenPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.decorateRequest('_oboAccessTokenMapKey', null);

    app.addHook('onRequest', async (req): Promise<void> => {
      req[OBO_ACCESS_TOKEN_MAP_KEY] = new Map();
    });

    if (isDeployed) {
      app.decorateRequest('ensureOboAccessToken', async function (appName: string, reply?: FastifyReply) {
        const oboAccessToken = this[OBO_ACCESS_TOKEN_MAP_KEY].get(appName) ?? (await getOboToken(appName, this, reply));

        if (oboAccessToken !== undefined) {
          log.debug({
            msg: `Adding OBO token for "${appName}". Had ${this[OBO_ACCESS_TOKEN_MAP_KEY].size} before.`,
            trace_id: this.trace_id,
            span_id: this.span_id,
            tab_id: this.tab_id,
            client_version: this.client_version,
            data: { route: this.url },
          });

          this[OBO_ACCESS_TOKEN_MAP_KEY].set(appName, oboAccessToken);
        }

        return oboAccessToken;
      });
    } else {
      app.decorateRequest('ensureOboAccessToken', NOOP);
    }

    app.decorateRequest('getOboAccessToken', function (appName: string) {
      log.debug({
        msg: `Getting OBO token for "${appName}". Has ${this[OBO_ACCESS_TOKEN_MAP_KEY].size} tokens.`,
        trace_id: this.trace_id,
        span_id: this.span_id,
        tab_id: this.tab_id,
        client_version: this.client_version,
        data: { route: this.url },
      });

      return this[OBO_ACCESS_TOKEN_MAP_KEY].get(appName);
    });

    pluginDone();
  },
  {
    fastify: '4',
    name: OBO_ACCESS_TOKEN_PLUGIN_ID,
    dependencies: [ACCESS_TOKEN_PLUGIN_ID, NAV_IDENT_PLUGIN_ID, SERVER_TIMING_PLUGIN_ID],
  },
);

type GetOboToken = (appName: string, req: FastifyRequest, reply?: FastifyReply) => Promise<string | undefined>;

const getOboToken: GetOboToken = async (appName, req, reply) => {
  const { trace_id, span_id, accessToken } = req;

  if (accessToken.length === 0) {
    return undefined;
  }

  try {
    const azureClientStart = performance.now();
    const authClient = await getAzureADClient();
    reply?.addServerTiming('azure_client_middleware', getDuration(azureClientStart), 'Azure Client Middleware');

    const oboStart = performance.now();
    const oboAccessToken = await getOnBehalfOfAccessToken(authClient, accessToken, appName, trace_id, span_id);

    const duration = getDuration(oboStart);
    oboRequestDuration.observe(duration);
    reply?.addServerTiming('obo_token_middleware', duration, 'OBO Token Middleware');

    return oboAccessToken;
  } catch (error) {
    log.warn({
      msg: `Failed to prepare request with OBO token.`,
      error,
      trace_id,
      span_id,
      data: { route: req.url },
    });

    return undefined;
  }
};
