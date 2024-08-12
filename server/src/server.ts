import { API_CLIENT_IDS } from '@app/config/config';
import { isDeployed } from '@app/config/env';
import { serverConfig } from '@app/config/server-config';
import { init } from '@app/init';
import { getLogger } from '@app/logger';
import { corsOptions } from '@app/config/cors';
import { accessTokenPlugin } from '@app/plugins/access-token';
import { apiProxyPlugin } from '@app/plugins/api-proxy';
import { clientVersionPlugin } from '@app/plugins/client-version';
import { documentPlugin } from '@app/plugins/document';
import { oboAccessTokenPlugin } from '@app/plugins/obo-token';
import { serveAssetsPlugin } from '@app/plugins/serve-assets';
import { serveIndexPlugin } from '@app/plugins/serve-index';
import { serverTimingPlugin } from '@app/plugins/server-timing';
import { tabIdPlugin } from '@app/plugins/tab-id';
import { traceparentPlugin } from '@app/plugins/traceparent/traceparent';
import { versionPlugin } from '@app/plugins/version/version';
import { processErrors } from '@app/process-errors';
import { EmojiIcons, sendToSlack } from '@app/slack';
import cors from '@fastify/cors';
import { fastify } from 'fastify';
import metricsPlugin from 'fastify-metrics';
import { querystringParser } from '@app/helpers/query-parser';
import { httpLoggerPlugin } from '@app/plugins/http-logger';
import { proxyVersionPlugin } from '@app/plugins/proxy-version';
import { healthPlugin } from '@app/plugins/health';
import { navIdentPlugin } from '@app/plugins/nav-ident';
import { crdtPlugin } from '@app/plugins/crdt/crdt';
import { fastifyWebsocket } from '@fastify/websocket';

processErrors();

const log = getLogger('server');

if (isDeployed) {
  log.info({ msg: 'Starting...' });

  sendToSlack('Starting...', EmojiIcons.LoadingDots);
}

const bodyLimit = 300 * 1024 * 1024; // 300 MB

fastify({ trustProxy: true, querystringParser, bodyLimit })
  .register(cors, corsOptions)
  .register(healthPlugin)
  .register(metricsPlugin, {
    endpoint: '/metrics',
    routeMetrics: {
      routeBlacklist: ['/metrics', '/isAlive', '/isReady', '/swagger', '/swagger.json'],
    },
  })
  .register(fastifyWebsocket)
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
  .register(serveAssetsPlugin)
  .register(serveIndexPlugin)
  .register(httpLoggerPlugin)
  .register(crdtPlugin)

  // Start server.
  .listen({ host: '0.0.0.0', port: serverConfig.port });

log.info({ msg: `Server listening on port ${serverConfig.port}` });

// Initialize.
init();
