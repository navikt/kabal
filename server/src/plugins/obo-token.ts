import { ApiClientEnum, NAIS_CLUSTER_NAME } from '@app/config/config';
import { isDeployed } from '@app/config/env';
import { getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import { NAV_IDENT_PLUGIN_ID } from '@app/plugins/nav-ident';
import { SERVER_TIMING_PLUGIN_ID } from '@app/plugins/server-timing';
import { proxyRegister } from '@app/prometheus/types';
import { requestOboToken, validateToken } from '@navikt/oasis';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Histogram } from 'prom-client';

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

const NO_OBO = [ApiClientEnum.KLAGE_KODEVERK_API.toString()];

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
        if (NO_OBO.includes(appName)) {
          return undefined;
        }

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
        return this.oboAccessTokenMap.get(appName);
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

export const getOboToken: GetOboToken = async (appName, req, reply) => {
  const { trace_id, span_id, accessToken, url, client_version, tab_id } = req;
  const logParams = { trace_id, span_id, client_version, tab_id, data: { route: url } };

  log.debug({ msg: `Getting OBO token for "${appName}".`, ...logParams });

  if (accessToken.length === 0) {
    log.warn({ msg: 'No access token provided.', ...logParams });

    return undefined;
  }

  const validation = await validateToken(accessToken);

  if (!validation.ok) {
    log.warn({ msg: 'Invalid access token.', ...logParams });

    return undefined;
  }

  try {
    const oboStart = performance.now();
    const audience = `api://${NAIS_CLUSTER_NAME}.klage.${appName}/.default`;

    log.debug({ msg: `Requesting OBO token for audience: ${audience}.`, ...logParams });

    const oboAccessToken = await requestOboToken(accessToken, audience);

    const duration = getDuration(oboStart);
    oboRequestDuration.observe(duration);
    reply?.addServerTiming('obo_token_middleware', duration, 'OBO Token Middleware');

    if (!oboAccessToken.ok) {
      log.warn({
        msg: `Failed to get OBO token for audience: ${audience}: ${JSON.stringify(oboAccessToken.error)}`,
        ...logParams,
      });

      return undefined;
    }

    log.debug({ msg: `OBO token for ${appName} received.`, ...logParams });

    return oboAccessToken.token;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    log.error({ msg: `Failed to prepare request with OBO token: ${errorMessage}`, ...logParams });

    return undefined;
  }
};

const oboRequestDuration = new Histogram({
  name: 'obo_request_duration',
  help: 'Duration of OBO token requests in milliseconds.',
  buckets: [0, 10, 100, 200, 300, 400, 500, 600, 800, 900, 1000],
  registers: [proxyRegister],
});
