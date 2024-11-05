import { CLIENT_VERSION_HEADER } from '@app/headers';
import { CLIENT_VERSION_QUERY, getHeaderOrQueryValue } from '@app/helpers/get-header-query';
import type { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    client_version: string;
  }
}

export const CLIENT_VERSION_PLUGIN_ID = 'client-version';

export const clientVersionPlugin = fastifyPlugin(
  async (app) => {
    app.decorateRequest('client_version', '');

    // biome-ignore lint/suspicious/useAwait: Needs to return a promise
    app.addHook('preHandler', async (req: FastifyRequest<{ Querystring: Record<string, string | undefined> }>) => {
      const client_version = getHeaderOrQueryValue(req, CLIENT_VERSION_HEADER, CLIENT_VERSION_QUERY);

      if (client_version !== undefined) {
        req.client_version = client_version;
      }
    });
  },
  { fastify: '5', name: CLIENT_VERSION_PLUGIN_ID },
);
