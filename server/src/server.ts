import cors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import { fastify } from 'fastify';
import metricsPlugin from 'fastify-metrics';
import { API_CLIENT_IDS } from '@/config/config';
import { corsOptions } from '@/config/cors';
import { isDeployed } from '@/config/env';
import { serverConfig } from '@/config/server-config';
import { querystringParser } from '@/helpers/query-parser';
import { init } from '@/init';
import { getLogger } from '@/logger';
import { accessTokenPlugin } from '@/plugins/access-token';
import { apiProxyPlugin } from '@/plugins/api-proxy';
import { clientVersionPlugin } from '@/plugins/client-version';
import { crdtPlugin } from '@/plugins/crdt/crdt';
import { debugPlugin } from '@/plugins/debug/debug';
import { documentPlugin } from '@/plugins/document';
import { fileViewerPlugin } from '@/plugins/file-viewer/file-viewer';
import { healthPlugin } from '@/plugins/health';
import { httpLoggerPlugin } from '@/plugins/http-logger';
import { navIdentPlugin } from '@/plugins/nav-ident';
import { oboAccessTokenPlugin } from '@/plugins/obo-token';
import { proxyVersionPlugin } from '@/plugins/proxy-version';
import { serveAssetsPlugin } from '@/plugins/serve-assets';
import { serveFileViewerAssetsPlugin } from '@/plugins/serve-file-viewer-assets';
import { serveIndexPlugin } from '@/plugins/serve-index';
import { serverTimingPlugin } from '@/plugins/server-timing';
import { tabIdPlugin } from '@/plugins/tab-id';
import { traceparentPlugin } from '@/plugins/traceparent/traceparent';
import { unleashProxyPlugin } from '@/plugins/unleash-proxy';
import { versionPlugin } from '@/plugins/version/version';
import { processErrors } from '@/process-errors';
import { EmojiIcons, sendToSlack } from '@/slack';

processErrors();

const log = getLogger('server');

if (isDeployed) {
  log.info({ msg: 'Starting...' });

  sendToSlack('Starting...', EmojiIcons.LoadingDots);
}

const bodyLimit = 300 * 1024 * 1024; // 300 MB

fastify({ trustProxy: true, bodyLimit, maxParamLength: 20_000, routerOptions: { querystringParser } })
  .register(fastifyWebsocket)
  .register(cors, corsOptions)
  .register(healthPlugin)
  .register(metricsPlugin, {
    endpoint: '/metrics',
    routeMetrics: {
      routeBlacklist: ['/metrics', '/isAlive', '/isStarted', '/swagger', '/swagger.json'],
    },
  })
  .register(proxyVersionPlugin)
  .register(traceparentPlugin)
  .register(tabIdPlugin)
  .register(clientVersionPlugin)
  .register(serverTimingPlugin, { enableAutoTotal: true })
  .register(accessTokenPlugin)
  .register(navIdentPlugin)
  .register(oboAccessTokenPlugin)
  .register(versionPlugin)
  .register(apiProxyPlugin, { appNames: API_CLIENT_IDS, prefix: '/api' })
  .register(documentPlugin)
  .register(fileViewerPlugin)
  .register(serveAssetsPlugin)
  .register(serveFileViewerAssetsPlugin)
  .register(serveIndexPlugin)
  .register(httpLoggerPlugin)
  .register(crdtPlugin)
  .register(debugPlugin)
  .register(unleashProxyPlugin)

  // Start server.
  .listen({ host: '0.0.0.0', port: serverConfig.port });

log.info({ msg: `Server listening on port ${serverConfig.port}` });

// Initialize.
init();
