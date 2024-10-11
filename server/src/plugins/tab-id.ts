import { TAB_ID_HEADER } from '@app/headers';
import { TAB_ID_QUERY, getHeaderOrQueryValue } from '@app/helpers/get-header-query';
import type { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    tab_id: string;
  }
}

export const TAB_ID_PLUGIN_ID = 'tab-id';

export const tabIdPlugin = fastifyPlugin(
  async (app) => {
    app.decorateRequest('tab_id', '');

    app.addHook('preHandler', async (req: FastifyRequest<{ Querystring: Record<string, string | undefined> }>) => {
      const tab_id = getHeaderOrQueryValue(req, TAB_ID_HEADER, TAB_ID_QUERY);

      if (tab_id !== undefined) {
        req.tab_id = tab_id;
      }
    });
  },
  { fastify: '5', name: TAB_ID_PLUGIN_ID },
);
