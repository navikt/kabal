import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { getCacheKey, oboCache } from '@/auth/cache/cache';
import { oboRequestDuration } from '@/auth/cache/cache-gauge';
import { getAzureADClient } from '@/auth/get-auth-client';
import { getOnBehalfOfAccessToken } from '@/auth/on-behalf-of';
import { isDeployed } from '@/config/env';
import { getDuration } from '@/helpers/duration';
import { getLogger } from '@/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@/plugins/access-token';
import { NAV_IDENT_PLUGIN_ID } from '@/plugins/nav-ident';
import { SERVER_TIMING_PLUGIN_ID } from '@/plugins/server-timing';

const log = getLogger('obo-token-plugin');

declare module 'fastify' {
  interface FastifyRequest {
    /** Sync access to existing OBO tokens. */
    oboAccessTokenMap: Map<string, string>;
    /** Gets OBO token and stores it in the map for syn access later. */
    getOboAccessToken(appName: string, reply?: FastifyReply): Promise<string | undefined>;
    getCachedOboAccessToken(appName: string): string | undefined;
  }
}

const ASYNC_NOOP = async () => undefined;
const SYNC_NOOP = () => undefined;

export const OBO_ACCESS_TOKEN_PLUGIN_ID = 'obo-access-token';

export const oboAccessTokenPlugin = fastifyPlugin(
  async (app) => {
    app.decorateRequest('oboAccessTokenMap');

    app.addHook('onRequest', async (req): Promise<void> => {
      req.oboAccessTokenMap = new Map();
    });

    if (isDeployed) {
      app.decorateRequest('getOboAccessToken', async function (appName: string, reply?: FastifyReply) {
        const requestOboAccessToken = this.oboAccessTokenMap.get(appName);

        if (requestOboAccessToken !== undefined) {
          return requestOboAccessToken;
        }

        const oboAccessToken = await getOboToken(appName, this, reply);

        if (oboAccessToken !== undefined) {
          this.oboAccessTokenMap.set(appName, oboAccessToken);
        } else {
          this.oboAccessTokenMap.delete(appName);
        }

        return oboAccessToken;
      });

      app.decorateRequest('getCachedOboAccessToken', function (appName: string) {
        return (
          this.oboAccessTokenMap.get(appName) ?? oboCache.getCached(getCacheKey(this.navIdent, appName)) ?? undefined
        );
      });
    } else {
      app.decorateRequest('getOboAccessToken', ASYNC_NOOP);
      app.decorateRequest('getCachedOboAccessToken', SYNC_NOOP);
    }
  },
  {
    fastify: '5',
    name: OBO_ACCESS_TOKEN_PLUGIN_ID,
    dependencies: [ACCESS_TOKEN_PLUGIN_ID, NAV_IDENT_PLUGIN_ID, SERVER_TIMING_PLUGIN_ID],
  },
);

type GetOboToken = (appName: string, req: FastifyRequest, reply?: FastifyReply) => Promise<string | undefined>;

const getOboToken: GetOboToken = async (appName, req, reply) => {
  const { trace_id, span_id, accessToken, navIdent, url, client_version, tab_id } = req;

  log.debug({
    msg: `Getting OBO token for "${appName}".`,
    trace_id,
    span_id,
    tab_id,
    client_version,
    data: { route: url },
  });

  if (accessToken.length === 0) {
    return undefined;
  }

  try {
    const azureClientStart = performance.now();
    const authClient = await getAzureADClient();
    reply?.addServerTiming('azure_client_middleware', getDuration(azureClientStart), 'Azure Client Middleware');

    const oboStart = performance.now();
    const oboAccessToken = await getOnBehalfOfAccessToken(
      authClient,
      accessToken,
      navIdent,
      appName,
      trace_id,
      span_id,
    );

    const duration = getDuration(oboStart);
    oboRequestDuration.observe(duration);
    reply?.addServerTiming('obo_token_middleware', duration, 'OBO Token Middleware');

    return oboAccessToken;
  } catch (error) {
    log.warn({
      msg: 'Failed to prepare request with OBO token.',
      error,
      trace_id,
      span_id,
      data: { route: req.url },
    });

    return undefined;
  }
};
