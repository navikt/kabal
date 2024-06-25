import { AUTHORIZATION_HEADER } from '@app/headers';
import { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    accessToken: string;
  }
}

export const accessTokenPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.decorateRequest('accessToken', '');

    app.addHook('preHandler', async (req) => {
      const accessToken = getAccessToken(req);

      if (accessToken !== undefined) {
        req.accessToken = accessToken;
      }
    });

    pluginDone();
  },
  { fastify: '4', name: 'access-token' },
);

export const getAccessToken = (req: FastifyRequest): string | undefined => {
  const authHeader = req.headers[AUTHORIZATION_HEADER];

  if (authHeader !== undefined) {
    const [, accessToken] = authHeader.split(' ');

    return accessToken;
  }

  return undefined;
};
