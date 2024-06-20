import { getIsReady } from '@app/config/config';
import { serverConfig } from '@app/config/server-config';
import { setContextVars } from '@app/middleware/set-context-vars';
import { traceIdAndParentToContext } from '@app/middleware/request-id';
import { setupDocumentRoutes } from '@app/routes/document';
import { setupProxyRoutes } from '@app/routes/setup-proxy';
import { prometheus } from '@hono/prometheus';
import { Hono } from 'hono';
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
import { serveStatic } from '@app/middleware/serve-assets';
import { serveIndex } from '@app/middleware/serve-index';
import { createServer } from 'node:http2';

processErrors();

const log = getLogger('server');

if (isDeployed) {
  log.info({ msg: 'Started!' });

  sendToSlack('Starting...', EmojiIcons.StartStruck);
}

const app = new Hono();

app.use(corsMiddleware);

app.get('/isAlive', ({ text }) => text('Alive', 200));
app.get('/isReady', ({ text }) => (getIsReady() ? text('Ready', 200) : text('Not Ready', 503)));

const { printMetrics, registerMetrics } = prometheus({ registry: proxyRegister });
app.get('/metrics', printMetrics);
app.use('*', registerMetrics); // Register metrics middleware for all routes below.

// Set up middleware for all routes below.
app.use(timing());
app.use(setContextVars);
app.use(setProxyVersionHeader);
app.use(traceIdAndParentToContext);
app.use(httpLoggingMiddleware);

// Set up routes.
setupVersionRoute(app);
setupDocumentRoutes(app);
setupProxyRoutes(app);

// Static file routes.
app.get('/', serveIndex);
app.get('/assets/*', serveStatic);
app.get('*', serveIndex);

// Set up error handling.
app.onError(async (error, context) => {
  log.error({ msg: 'Server error', error });

  return context.text('Internal Server Error', 500);
});

// Initialize.
init();

log.info({ msg: `Server initialized on port ${serverConfig.port}` });

export default {
  port: serverConfig.port,
  fetch: app.fetch,
  createServer,
};
