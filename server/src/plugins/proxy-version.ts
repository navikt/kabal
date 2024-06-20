import { PROXY_VERSION } from '@app/config/config';
import { PROXY_VERSION_HEADER } from '@app/headers';
import fastifyPlugin from 'fastify-plugin';

export const PROXY_VERSION_PLUGIN_ID = 'proxy-version';

export const proxyVersionPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    // Add proxy version header to all responses.
    app.addHook('onSend', async (__, reply) => {
      reply.header(PROXY_VERSION_HEADER, PROXY_VERSION);
    });

    pluginDone();
  },
  { fastify: '4', name: PROXY_VERSION_PLUGIN_ID },
);
