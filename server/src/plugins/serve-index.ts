import { existsSync, readFileSync } from 'node:fs';
import { frontendDistDirectoryPath, PROXY_VERSION } from '@app/config/config';
import { ENVIRONMENT } from '@app/config/env';
import { getLogger } from '@app/logger';
import type { RouteHandler } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('serve-index-file');

const indexFilePath = `${frontendDistDirectoryPath}/index.html`;

if (!existsSync(indexFilePath)) {
  log.error({ msg: 'Index file does not exist', data: { path: indexFilePath } });
  process.exit(1);
}

const indexFileContent = readFileSync(indexFilePath, { encoding: 'utf-8' });
const indexFile = indexFileContent.replace('{{ENVIRONMENT}}', ENVIRONMENT).replace('{{VERSION}}', PROXY_VERSION);

const serveIndexHandler: RouteHandler = (_, reply) => {
  reply.header('content-type', 'text/html');
  reply.status(200);

  return reply.send(indexFile);
};

export const SERVE_INDEX_PLUGIN_ID = 'serve-index';

export const serveIndexPlugin = fastifyPlugin(
  async (app) => {
    app.get('/', serveIndexHandler);
    app.get('*', serveIndexHandler);
  },
  { fastify: '5', name: SERVE_INDEX_PLUGIN_ID },
);
