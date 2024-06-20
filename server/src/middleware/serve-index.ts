import { getLogger } from '@app/logger';
import { existsSync, readFileSync } from 'node:fs';
import { PROXY_VERSION, frontendDistDirectoryPath } from '@app/config/config';
import { ENVIRONMENT } from '@app/config/env';
import { RouteHandler } from 'fastify';

const log = getLogger('serve-index-file');

const indexFilePath = `${frontendDistDirectoryPath}/index.html`;

if (!existsSync(indexFilePath)) {
  log.error({ msg: 'Index file does not exist', data: { path: indexFilePath } });
  process.exit(1);
}

const indexFileContent = readFileSync(indexFilePath, { encoding: 'utf-8' });
const indexFile = indexFileContent.replace('{{ENVIRONMENT}}', ENVIRONMENT).replace('{{VERSION}}', PROXY_VERSION);

export const serveIndex: RouteHandler = async (_, res) => {
  res.header('content-type', 'text/html');
  res.status(200);

  return res.send(indexFile);
};
