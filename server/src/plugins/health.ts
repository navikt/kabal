import fastifyPlugin from 'fastify-plugin';
import { SMART_DOCUMENT_WRITE_ACCESS } from '@/document-access/service';
import { getLogger } from '@/logger';
import { isShuttingDown } from '@/shutdown';

export const HEALTH_PLUGIN_ID = 'health';

const log = getLogger('liveness');

export const healthPlugin = fastifyPlugin(
  async (app) => {
    app.get('/isAlive', (__, reply) => {
      if (isShuttingDown()) {
        return reply.status(200).type('text/plain').send('Shutting down');
      }

      // Kafka health is intentionally NOT part of liveness. The service degrades
      // to API polling when Kafka is unavailable, so the process is still alive
      // and able to serve. Restarting the pod on Kafka flakiness only makes
      // things worse. Kafka errors are surfaced via logs and metrics instead.
      const errors = SMART_DOCUMENT_WRITE_ACCESS.getErrors();

      if (errors.length > 0) {
        log.warn({ msg: `Document Write Access Kafka Consumer degraded, using API fallback: ${errors.join(', ')}` });
      }

      return reply.status(200).type('text/plain').send('Ready');
    });

    app.get('/isStarted', async (__, reply) => {
      // Startup readiness gates on init() having completed, not on Kafka health
      // or the access map having data. Access data is fetched on-demand when a
      // user connects to a document.
      if (!SMART_DOCUMENT_WRITE_ACCESS.isReady()) {
        log.debug({ msg: 'Document Write Access not yet initialized' });

        return reply.status(503).type('text/plain').send('Document Write Access not yet initialized');
      }

      return reply.status(200).type('text/plain').send('Ready');
    });
  },
  { fastify: '5', name: HEALTH_PLUGIN_ID },
);
