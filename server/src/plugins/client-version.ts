import { CLIENT_VERSION_HEADER } from '@app/headers';
import { CLIENT_VERSION_QUERY, getHeaderOrQueryValue } from '@app/helpers/get-header-query';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    clientVersion: string;
  }
}

export const CLIENT_VERSION_PLUGIN_ID = 'client-version';

export const clientVersionPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.decorateRequest('clientVersion', '');

    app.addHook('preHandler', async (req) => {
      const clientVersion = getHeaderOrQueryValue(req, CLIENT_VERSION_HEADER, CLIENT_VERSION_QUERY);

      if (clientVersion !== undefined) {
        req.clientVersion = clientVersion;
      }
    });

    pluginDone();
  },
  { fastify: '4', name: CLIENT_VERSION_PLUGIN_ID },
);
