import { MiddlewareHandler } from 'hono';
import { getLogger } from '@app/logger';
import { PROXY_VERSION, frontendDistDirectoryPath } from '@app/config/config';
import { ENVIRONMENT } from '@app/config/env';

const log = getLogger('serve-index-file');

const indexFilePath = `${frontendDistDirectoryPath}/index.html`;
const rawIndexFile = Bun.file(indexFilePath);
const indexFileExists = await rawIndexFile.exists();

if (!indexFileExists) {
  log.error({ msg: 'Index file does not exist', data: { path: indexFilePath } });
  process.exit(1);
}

const indexFileContent = await rawIndexFile.text();
const indexFile = indexFileContent.replace('{{ENVIRONMENT}}', ENVIRONMENT).replace('{{VERSION}}', PROXY_VERSION);

export const serveIndex: MiddlewareHandler = async (context) => {
  context.header('Content-Type', 'text/html');

  return context.body(indexFile, 200);
};
