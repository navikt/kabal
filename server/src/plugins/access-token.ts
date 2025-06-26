import { AUTHORIZATION_HEADER } from '@app/headers';
import type { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    accessToken: string;
  }
}

export const ACCESS_TOKEN_PLUGIN_ID = 'access-token';

export const accessTokenPlugin = fastifyPlugin(
  async (app) => {
    app.decorateRequest('accessToken', '');

    app.addHook('preHandler', async (req) => {
      const accessToken = getAccessToken(req);

      if (accessToken !== undefined) {
        req.accessToken = accessToken;
      }
    });
  },
  { fastify: '5', name: ACCESS_TOKEN_PLUGIN_ID },
);

export const getAccessToken = (req: FastifyRequest): string | undefined => {
  const authHeader = req.headers[AUTHORIZATION_HEADER];

  if (authHeader !== undefined) {
    const [, accessToken] = authHeader.split(' ');

    return accessToken;
  }

  return undefined;
};
