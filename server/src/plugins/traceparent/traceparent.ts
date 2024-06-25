import { traceIdAndParentToContext } from '@app/plugins/traceparent/request-id';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    traceparent: string;
    traceId: string;
  }
}

export const TRACEPARENT_PLUGIN_ID = 'traceparent';

export const traceparentPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.decorateRequest('traceparent', '');
    app.decorateRequest('traceId', '');

    app.addHook('preHandler', async (req) => {
      const { traceId, traceparent } = traceIdAndParentToContext(req);
      req.traceId = traceId;
      req.traceparent = traceparent;
    });

    pluginDone();
  },
  { fastify: '4', name: TRACEPARENT_PLUGIN_ID },
);
