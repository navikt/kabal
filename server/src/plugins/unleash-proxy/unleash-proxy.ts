import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';
import { NAV_IDENT_PLUGIN_ID } from '@/plugins/nav-ident';
import { handleJson } from '@/plugins/unleash-proxy/handle-json';
import { handleSse } from '@/plugins/unleash-proxy/handle-sse';
import { toggleParams, toggleQuerystring } from '@/plugins/unleash-proxy/types';

export const unleashProxyPlugin = fastifyPlugin(
  async (app) => {
    app.withTypeProvider<TypeBoxTypeProvider>().get(
      '/feature-toggle/:toggle',
      {
        schema: {
          params: toggleParams,
          querystring: toggleQuerystring,
        },
      },
      async (req, reply) => {
        if (req.headers.accept?.toLowerCase().includes('text/event-stream')) {
          return handleSse(req, reply);
        }

        return handleJson(req, reply);
      },
    );
  },
  { fastify: '5', name: 'unleash-proxy', dependencies: [NAV_IDENT_PLUGIN_ID] },
);
