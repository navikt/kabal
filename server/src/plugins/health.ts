import { oboCache } from '@app/auth/cache/cache';
import { getIsAzureClientReady } from '@app/auth/get-auth-client';
import { getLogger } from '@app/logger';
import fastifyPlugin from 'fastify-plugin';

export const HEALTH_PLUGIN_ID = 'health';

const log = getLogger('liveness');

export const healthPlugin = fastifyPlugin(
  async (app) => {
    app.get('/isAlive', (__, reply) => reply.status(200).type('text/plain').send('Alive'));

    app.get('/isReady', async (__, reply) => {
      const isAzureClientReady = getIsAzureClientReady();

      if (!oboCache.isReady && !isAzureClientReady) {
        log.info({ msg: 'OBO Cache and Azure Client not ready' });

        return reply.status(503).type('text/plain').send('OBO Cache and Azure Client not ready');
      }

      if (!oboCache.isReady) {
        log.info({ msg: 'OBO Cache not ready' });

        return reply.status(503).type('text/plain').send('OBO Cache not ready');
      }

      if (!isAzureClientReady) {
        log.info({ msg: 'Azure Client not ready' });

        return reply.status(503).type('text/plain').send('Azure Client not ready');
      }

      return reply.status(200).type('text/plain').send('Ready');
    });
  },
  { fastify: '5', name: HEALTH_PLUGIN_ID },
);
