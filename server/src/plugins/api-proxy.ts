import proxy from '@fastify/http-proxy';
import { DEV_URL, isDeployed } from '@app/config/env';
import { prepareRequestHeaders } from '@app/helpers/prepare-request-headers';
import { getLogger } from '@app/logger';
import { getDuration } from '@app/helpers/duration';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('api-proxy');

declare module 'fastify' {
  export interface FastifyRequest {
    proxyStartTime: number;
  }
}

export interface ApiProxyPluginOptions {
  appNames: string[];
}

export const apiProxyPlugin = fastifyPlugin<ApiProxyPluginOptions>(
  (app, { appNames }, pluginDone) => {
    app.decorateRequest('proxyStartTime', 0);

    for (const appName of appNames) {
      const baseUrl = isDeployed ? `http://${appName}` : `${DEV_URL}/api/${appName}`;
      const prefix = `/api/${appName}`;

      app.register(proxy, {
        upstream: baseUrl,
        prefix,
        disableCache: true,
        websocket: true,
        preHandler: (req, _, done) => {
          req.proxyStartTime = performance.now();

          done();
        },
        replyOptions: {
          onResponse: (req, reply, res) => {
            const { method, url, traceId, tabId, clientVersion, proxyStartTime } = req;
            const responseTime = getDuration(proxyStartTime);
            const { statusCode } = reply;
            const apiServerTiming = reply.getHeader('server-timing');

            log.info({
              msg: `Proxy response (${appName}) ${statusCode} ${method} ${url} ${responseTime}ms`,
              traceId,
              client_version: clientVersion,
              tab_id: tabId,
              data: { method, url, statusCode, responseTime, apiServerTiming },
            });

            if (typeof apiServerTiming === 'string') {
              reply.appendServerTimingHeader(apiServerTiming);
            }

            reply.addServerTiming('proxy', responseTime, appName);

            return reply.send(res);
          },
          rewriteRequestHeaders: (req, headers) => prepareRequestHeaders(req, headers, appName),
        },
      });
    }

    pluginDone();
  },
  { fastify: '4', name: 'api-proxy', dependencies: ['obo-access-token', 'server-timing'] },
);
