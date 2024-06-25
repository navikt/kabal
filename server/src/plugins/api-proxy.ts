import proxy from '@fastify/http-proxy';
import { DEV_URL, isDeployed } from '@app/config/env';
import { getProxyRequestHeaders } from '@app/helpers/prepare-request-headers';
import { getLogger } from '@app/logger';
import { getDuration } from '@app/helpers/duration';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('api-proxy');

declare module 'fastify' {
  interface FastifyRequest {
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
      const upstream = isDeployed ? `http://${appName}` : `${DEV_URL}/api/${appName}`;
      const prefix = `/api/${appName}`;

      app.register(proxy, {
        upstream,
        prefix,
        disableCache: true,
        websocket: true,
        preHandler: async (req, reply, done) => {
          req.proxyStartTime = performance.now();
          await req.ensureOboAccessToken(appName, reply);
          done();
        },
        replyOptions: {
          rewriteRequestHeaders: (req) => getProxyRequestHeaders(req, appName),
          onResponse: (req, reply, res) => {
            const { method, url, traceId, tabId, clientVersion, proxyStartTime } = req;
            const responseTime = getDuration(proxyStartTime);
            const { statusCode } = reply;

            log.info({
              msg: `Proxy response (${appName}) ${statusCode} ${method} ${url} ${responseTime}ms`,
              traceId,
              client_version: clientVersion,
              tab_id: tabId,
              data: { method, url, statusCode, responseTime },
            });

            const apiServerTiming = reply.getHeader('server-timing');

            if (typeof apiServerTiming === 'string' && apiServerTiming.length !== 0) {
              reply.appendServerTimingHeader(apiServerTiming);
            }

            reply.addServerTiming('proxy', responseTime, appName);

            return reply.send(res);
          },
        },
      });
    }

    pluginDone();
  },
  { fastify: '4', name: 'api-proxy', dependencies: ['obo-access-token', 'server-timing'] },
);
