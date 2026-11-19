import { validateToken } from '@navikt/oasis';
import type { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { isDeployed } from '@/config/env';
import { getLogger } from '@/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@/plugins/access-token';
import { createBehandlingFinishedConsumer } from '@/plugins/highlights/behandling-finished';
import { getBehandlingStatus } from '@/plugins/highlights/behandling-status';
import { createMemoryHighlightRepository, createValkeyHighlightRepository } from '@/plugins/highlights/repository';
import { registerHighlightRoutes } from '@/plugins/highlights/routes';
import { type SnapshotMetrics, startSnapshotMetrics } from '@/plugins/highlights/snapshot-metrics';
import { NAV_IDENT_PLUGIN_ID } from '@/plugins/nav-ident';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@/plugins/obo-token';
import { getHighlightsValkeyConfig } from '@/valkey/valkey-client';

const log = getLogger('highlights');

/** Personal marker highlights for the file viewer. */
export const highlightsPlugin = fastifyPlugin(
  async (app) => {
    const config = getHighlightsValkeyConfig();

    if (config === null) {
      if (isDeployed) {
        log.error({ msg: 'No highlights Valkey connection configured. Highlights are not shared between pods.' });
      }

      registerHighlightRoutes(app, {
        repository: createMemoryHighlightRepository(),
        getNavIdent,
        getBehandlingStatus,
      });

      return;
    }

    const repository = createValkeyHighlightRepository(config);
    const consumer = createBehandlingFinishedConsumer(repository);
    // Started when the server is ready, so a failed startup leaves nothing running.
    let snapshotMetrics: SnapshotMetrics | null = null;

    registerHighlightRoutes(app, { repository, getNavIdent, getBehandlingStatus });
    app.addHook('onReady', async () => {
      consumer.connect();
      snapshotMetrics = startSnapshotMetrics({ repository });
    });
    app.addHook('onClose', async () => {
      // The Kafka consumer should not wait for a running scan.
      await Promise.all([snapshotMetrics?.stop(), consumer.close()]);
      await repository.close();
    });
  },
  {
    fastify: '5',
    name: 'highlights',
    dependencies: [ACCESS_TOKEN_PLUGIN_ID, NAV_IDENT_PLUGIN_ID, OBO_ACCESS_TOKEN_PLUGIN_ID],
  },
);

/** Highlights are personal, so the NAV-ident must come from a validated token. `req.navIdent` is not validated. */
const getNavIdent = async (req: FastifyRequest): Promise<string | null> => {
  if (!isDeployed) {
    return req.navIdent.length === 0 ? null : req.navIdent;
  }

  if (req.accessToken.length === 0) {
    return null;
  }

  const validation = await validateToken(req.accessToken);

  if (!validation.ok) {
    log.warn({ msg: `Invalid access token: ${validation.error.message} (${validation.errorType})` });

    return null;
  }

  const { NAVident } = validation.payload;

  return typeof NAVident === 'string' && NAVident.length > 0 ? NAVident : null;
};
