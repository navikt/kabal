import { PROXY_VERSION } from '@app/config/config';
import { PROXY_VERSION_HEADER } from '@app/headers';
import fastifyPlugin from 'fastify-plugin';

export const PROXY_VERSION_PLUGIN_ID = 'proxy-version';

export const proxyVersionPlugin = fastifyPlugin(
  async (app) => {
    // Add proxy version header to all responses.
    // biome-ignore lint/suspicious/useAwait: Needs to return a promise
    app.addHook('onSend', async (__, reply) => {
      reply.header(PROXY_VERSION_HEADER, PROXY_VERSION);
    });
  },
  { fastify: '5', name: PROXY_VERSION_PLUGIN_ID },
);
