import { getIsReady } from '@app/config/config';
import { serverConfig } from '@app/config/server-config';
import { setContextVars } from '@app/middleware/set-context-vars';
import { traceIdAndParentToContext } from '@app/middleware/request-id';
import { setupDocumentRoutes } from '@app/routes/document';
import { setupProxyRoutes } from '@app/routes/setup-proxy';
import { setupStaticRoutes } from '@app/routes/static-routes';
import { prometheus } from '@hono/prometheus';
import { Hono } from 'hono';
import { createServer } from 'node:http2';
import { isDeployed } from '@app/config/env';
import { httpLoggingMiddleware } from '@app/middleware/http-logger';
import { init } from '@app/init';
import { getLogger } from '@app/logger';
import { processErrors } from '@app/process-errors';
import { EmojiIcons, sendToSlack } from '@app/slack';
import { setupVersionRoute } from '@app/routes/version/version';
import { setProxyVersionHeader } from '@app/middleware/proxy-version-header';
import { proxyRegister } from '@app/prometheus/types';
import { corsMiddleware } from '@app/middleware/cors';
import { timing } from 'hono/timing';

processErrors();

const log = getLogger('server');

if (isDeployed) {
  log.info({ msg: 'Started!' });

  sendToSlack('Starting...', EmojiIcons.StartStruck);
}

const server: Hono = new Hono();

server.use(corsMiddleware);

server.get('/isAlive', ({ text }) => text('Alive', 200));
server.get('/isReady', ({ text }) => (getIsReady() ? text('Ready', 200) : text('Not Ready', 418)));

const { printMetrics, registerMetrics } = prometheus({ registry: proxyRegister });
server.get('/metrics', printMetrics);
server.use('*', registerMetrics); // Register metrics middleware for all routes below.

// Set up middleware for all routes below.
server.use(timing());
server.use(setContextVars);
server.use(setProxyVersionHeader);
server.use(traceIdAndParentToContext);
server.use(httpLoggingMiddleware);

// Set up routes.
setupVersionRoute(server);
setupDocumentRoutes(server);
setupProxyRoutes(server);
setupStaticRoutes(server);

// Set up error handling.
server.onError(async (error, context) => {
  log.error({ msg: 'Server error', error });

  return context.text('Internal Server Error', 500);
});

// Initialize.
init();

log.info({ msg: `Server initialized on port ${serverConfig.port}` });

export default {
  port: serverConfig.port,
  fetch: server.fetch,
  createServer,
};
