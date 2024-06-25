import { TAB_ID_HEADER } from '@app/headers';
import { TAB_ID_QUERY, getHeaderOrQueryValue } from '@app/helpers/get-header-query';
import { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    tabId: string;
  }
}

export const TAB_ID_PLUGIN_ID = 'tab-id';

export const tabIdPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.decorateRequest('tabId', '');

    app.addHook('preHandler', async (req: FastifyRequest<{ Querystring: Record<string, string | undefined> }>) => {
      const tabId = getHeaderOrQueryValue(req, TAB_ID_HEADER, TAB_ID_QUERY);

      if (tabId !== undefined) {
        req.tabId = tabId;
      }
    });

    pluginDone();
  },
  { fastify: '4', name: TAB_ID_PLUGIN_ID },
);
