import { CLIENT_VERSION_HEADER } from '@app/headers';
import { CLIENT_VERSION_QUERY, getHeaderOrQueryValue } from '@app/helpers/get-header-query';
import { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    client_version: string;
  }
}

export const CLIENT_VERSION_PLUGIN_ID = 'client-version';

export const clientVersionPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.decorateRequest('client_version', '');

    app.addHook('preHandler', async (req: FastifyRequest<{ Querystring: Record<string, string | undefined> }>) => {
      const client_version = getHeaderOrQueryValue(req, CLIENT_VERSION_HEADER, CLIENT_VERSION_QUERY);

      if (client_version !== undefined) {
        req.client_version = client_version;
      }
    });

    pluginDone();
  },
  { fastify: '5', name: CLIENT_VERSION_PLUGIN_ID },
);
