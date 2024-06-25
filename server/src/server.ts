import { API_CLIENT_IDS, frontendDirectoryPath, getIsReady } from '@app/config/config';
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
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import metricsPlugin from 'fastify-metrics';
import { readFileSync } from 'node:fs';
import { queryParser } from '@app/helpers/query-parser';
import { httpLoggerPlugin } from '@app/plugins/http-logger';
import { proxyVersionPlugin } from '@app/plugins/proxy-version';

processErrors();

const log = getLogger('server');

if (isDeployed) {
  log.info({ msg: 'Starting...' });

  sendToSlack('Starting...', EmojiIcons.LoadingDots);
}

await fastify({ trustProxy: true, querystringParser: queryParser })
  .register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Kabal frontend proxy',
        version: '1.0.0',
      },
    },
    hideUntagged: true,
  })
  .register(swaggerUI, {
    routePrefix: '/swagger',
    logo: { type: 'image/png', content: readFileSync(`${frontendDirectoryPath}/assets/android-chrome-512x512.png`) },
  })
  .register(cors, corsOptions)
  .register(metricsPlugin, {
    endpoint: '/metrics',
    routeMetrics: {
      routeBlacklist: ['/metrics', '/isAlive', '/isReady', '/swagger', '/swagger.json'],
    },
  })
  .register(traceparentPlugin)
  .register(tabIdPlugin)
  .register(clientVersionPlugin)
  .register(serverTimingPlugin, { enableAutoTotal: true })
  .register(accessTokenPlugin)
  .register(oboAccessTokenPlugin)
  .register(versionPlugin)
  .register(apiProxyPlugin, { appNames: API_CLIENT_IDS, prefix: '/api' })
  .register(documentPlugin)
  .register(serveAssetsPlugin)
  .register(serveIndexPlugin)
  .register(proxyVersionPlugin)
  .register(httpLoggerPlugin)

  // Health checks.
  .get('/isAlive', (_, reply) => reply.status(200).type('text/plain').send('Alive'))
  .get('/isReady', async (_, reply) =>
    getIsReady()
      ? reply.status(200).type('text/plain').send('Ready')
      : reply.status(503).type('text/plain').send('Not Ready'),
  )

  // Start server.
  .listen({ host: '0.0.0.0', port: serverConfig.port });

// Initialize.
await init();

log.info({ msg: `Server initialized on port ${serverConfig.port}` });

await sendToSlack('Started!', EmojiIcons.Tada);
