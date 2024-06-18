import fs from 'fs';
import { PROXY_VERSION, frontendDistDirectoryPath } from '@app/config/config';
import { ENVIRONMENT } from '@app/config/env';
import { serveStatic } from 'hono/bun';
import { Hono } from 'hono';

const indexFile = fs
  .readFileSync(`${frontendDistDirectoryPath}/index.html`, 'utf8')
  .replace('{{ENVIRONMENT}}', ENVIRONMENT)
  .replace('{{VERSION}}', PROXY_VERSION);

export const setupStaticRoutes = (server: Hono) => {
  server.get('/', ({ html }) => html(indexFile, 200));

  server.get('/assets/*', serveStatic({ root: '../frontend/dist' }));

  server.get('*', ({ html }) => html(indexFile, 200));
};
