import { SMART_DOCUMENT_WRITE_ACCESS } from '@app/document-access/service';
import { getLogger } from '@app/logger';
import { isShuttingDown } from '@app/shutdown';
import fastifyPlugin from 'fastify-plugin';

export const HEALTH_PLUGIN_ID = 'health';

const log = getLogger('liveness');

export const healthPlugin = fastifyPlugin(
  async (app) => {
    app.get('/isAlive', (__, reply) => {
      if (isShuttingDown()) {
        return reply.status(200).type('text/plain').send('Shutting down');
      }

      const errors = SMART_DOCUMENT_WRITE_ACCESS.getErrors();

      if (errors.length > 0) {
        log.error({ msg: `Document Write Access Kafka Consumer is not processing: ${errors.join(', ')}` });
        return reply.status(503).type('text/plain').send('Document Write Access Kafka Consumer is not processing');
      }

      return reply.status(200).type('text/plain').send('Ready');
    });

    app.get('/isStarted', async (__, reply) => {
      const errors = SMART_DOCUMENT_WRITE_ACCESS.getErrors();

      if (errors.length > 0) {
        log.debug({
          msg: `Document Write Access Kafka Consumer is not yet processing: ${errors.join(', ')}`,
        });
        return reply.status(503).type('text/plain').send('Document Write Access Kafka Consumer is not yet processing');
      }

      return reply.status(200).type('text/plain').send('Ready');
    });
  },
  { fastify: '5', name: HEALTH_PLUGIN_ID },
);
