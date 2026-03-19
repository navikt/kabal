import type { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { CLIENT_VERSION_HEADER } from '@/headers';
import { CLIENT_VERSION_QUERY, getHeaderOrQueryValue } from '@/helpers/get-header-query';
import type { Querystring } from '@/helpers/query-parser';

declare module 'fastify' {
  interface FastifyRequest {
    client_version: string;
  }
}

export const CLIENT_VERSION_PLUGIN_ID = 'client-version';

export const clientVersionPlugin = fastifyPlugin(
  async (app) => {
    app.decorateRequest('client_version', '');

    app.addHook('preHandler', async (req: FastifyRequest<{ Querystring: Querystring }>) => {
      const client_version = getHeaderOrQueryValue(req, CLIENT_VERSION_HEADER, CLIENT_VERSION_QUERY);

      if (client_version !== undefined) {
        req.client_version = client_version;
      }
    });
  },
  { fastify: '5', name: CLIENT_VERSION_PLUGIN_ID },
);
