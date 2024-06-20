import { API_CLIENT_IDS, PROXY_VERSION, getIsReady } from '@app/config/config';
import cors from '@fastify/cors';
import { serverConfig } from '@app/config/server-config';
import { CLIENT_VERSION_QUERY, TAB_ID_QUERY, getHeaderOrQueryValue } from '@app/middleware/set-context-vars';
import { traceIdAndParentToContext } from '@app/middleware/request-id';
import { isDeployed } from '@app/config/env';
import { logHttpRequest } from '@app/middleware/http-logger';
import { init } from '@app/init';
import { getLogger } from '@app/logger';
import { processErrors } from '@app/process-errors';
import { EmojiIcons, sendToSlack } from '@app/slack';
import { corsOptions } from '@app/middleware/cors';
import { serveStatic } from '@app/middleware/serve-assets';
import { serveIndex } from '@app/middleware/serve-index';
import { CLIENT_VERSION_HEADER, PROXY_VERSION_HEADER, TAB_ID_HEADER } from '@app/headers';
import { getDuration } from '@app/helpers/duration';
import { fastify } from 'fastify';
import { setupDocumentRoutes } from '@app/routes/document';
import { versionHandler } from '@app/routes/version/version';
import { apiProxyPlugin } from '@app/plugins/api-proxy';
import { serverTimingPlugin } from '@app/plugins/server-timing';
import { oboAccessTokenPlugin } from '@app/plugins/obo-token';
import { accessTokenPlugin } from '@app/plugins/access-token';

processErrors();

const log = getLogger('server');

if (isDeployed) {
  log.info({ msg: 'Started!' });

  sendToSlack('Starting...', EmojiIcons.StartStruck);
}

const app = fastify()
  .register(cors, corsOptions)
  .register(serverTimingPlugin, { enableAutoTotal: true })
  .register(accessTokenPlugin)
  .register(oboAccessTokenPlugin, { appNames: API_CLIENT_IDS })
  .register(apiProxyPlugin, { appNames: API_CLIENT_IDS })

  // Pre-decorate request object with custom properties for better JS performance.
  .decorateRequest('tabId', '')
  .decorateRequest('clientVersion', '')
  .decorateRequest('traceparent', '')
  .decorateRequest('traceId', '')

  // Health checks.
  .get('/isAlive', () => 'Alive')
  .get('/isReady', async (_, res) =>
    getIsReady()
      ? res.status(200).type('text/plain').send('Ready')
      : res.status(503).type('text/plain').send('Not Ready'),
  )

  // Metrics.
  // const { printMetrics, registerMetrics } = prometheus({ registry: proxyRegister });
  // .get('/metrics', printMetrics);
  // .use('*', registerMetrics); // Register metrics middleware for all routes below.

  // Add proxy version header to all responses.
  .addHook('onResponse', (_, res) => {
    res.header(PROXY_VERSION_HEADER, PROXY_VERSION);
  })

  // Set relevant request context variables.
  .addHook('preHandler', async (req) => {
    req.tabId = getHeaderOrQueryValue(req, TAB_ID_HEADER, TAB_ID_QUERY) ?? '';
    req.clientVersion = getHeaderOrQueryValue(req, CLIENT_VERSION_HEADER, CLIENT_VERSION_QUERY) ?? '';
    const { traceId, traceparent } = traceIdAndParentToContext(req);
    req.traceId = traceId;
    req.traceparent = traceparent;
  })

  // Log HTTP requests.
  .addHook('onResponse', async (req, res) => {
    const { url } = req;

    if (url.endsWith('/isAlive') || url.endsWith('/isReady') || url.endsWith('/metrics')) {
      return;
    }

    const { traceId, clientVersion, tabId, startTime } = req;

    const responseTime = getDuration(startTime);

    logHttpRequest({
      method: req.method,
      url,
      statusCode: res.statusCode,
      traceId,
      client_version: clientVersion,
      tab_id: tabId,
      responseTime,
      request_content_length: req.headers['content-length'],
      request_content_type: req.headers['content-type'],
      response_content_length: res.getHeader('content-length'),
      response_content_type: res.getHeader('content-type'),
    });
  })

  // Version route.
  .get('/version', versionHandler);

// setupDocumentRoutes(app);

// Static file routes.
app.get('/', serveIndex);
app.get('/assets/*', serveStatic);
app.get('*', serveIndex);

// Start server.
export const startServer = () => app.listen({ port: serverConfig.port });

// Initialize.
init();

log.info({ msg: `Server initialized on port ${serverConfig.port}` });
