import { DEV_URL, isDeployed } from '@app/config/env';
import { getDuration } from '@app/helpers/duration';
import { getProxyRequestHeaders } from '@app/helpers/prepare-request-headers';
import { getLogger } from '@app/logger';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { SERVER_TIMING_HEADER, SERVER_TIMING_PLUGIN_ID } from '@app/plugins/server-timing';
import proxy from '@fastify/http-proxy';
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
  async (app, { appNames }) => {
    app.decorateRequest('proxyStartTime', 0);

    app.addHook('onSend', async (req, reply) => {
      if (!req.url.startsWith('/api/')) {
        return;
      }

      const appName = req.url.split('/').at(2);

      if (appName === undefined || !appNames.includes(appName)) {
        return;
      }

      const { method, url, trace_id, span_id, tab_id, client_version, proxyStartTime } = req;
      const responseTime = getDuration(proxyStartTime);

      log.debug({
        msg: `Proxy response (${appName}) ${reply.statusCode} ${method} ${url} ${responseTime}ms`,
        trace_id,
        span_id,
        client_version,
        tab_id,
        data: {
          method,
          url,
          statusCode: reply.statusCode,
          responseTime,
          contentType: reply.getHeader('content-type'),
          contentLength: reply.getHeader('content-length'),
        },
      });
    });

    for (const appName of appNames) {
      const upstream = isDeployed ? `http://${appName}` : `${DEV_URL}/api/${appName}`;
      const prefix = `/api/${appName}`;

      app.register(proxy, {
        upstream,
        prefix,
        cacheURLs: 10_000,
        websocket: true,
        proxyPayloads: true,
        preHandler: async (req, reply) => {
          log.debug({
            msg: `Proxy request (${appName}) ${req.method} ${req.url}`,
            tab_id: req.tab_id,
            trace_id: req.trace_id,
            span_id: req.span_id,
            data: {
              method: req.method,
              contentType: req.headers['content-type'],
              contentLength: req.headers['content-length'],
              url: req.url,
            },
          });

          // Make sure the OBO token is cached before rewriteRequestHeaders.
          await req.getOboAccessToken(appName, reply);

          req.proxyStartTime = performance.now();
        },
        retryMethods: ['GET'], // Only retry GET requests. All others are not idempotent.
        replyOptions: {
          rewriteRequestHeaders: (req) => getProxyRequestHeaders(req, appName, req.getCachedOboAccessToken(appName)),
          rewriteHeaders: (headers, req) => {
            const serverTiming = headers[SERVER_TIMING_HEADER];

            const total = `proxy;dur=${req === undefined ? 0 : getDuration(req.proxyStartTime)};desc="${appName} (proxy)"`;

            switch (typeof serverTiming) {
              case 'string':
                return {
                  ...headers,
                  [SERVER_TIMING_HEADER]: serverTiming
                    .split(',')
                    .map((entry) => prefixServerTimingEntry(entry, appName))
                    .concat(total)
                    .join(', '),
                };
              case 'object':
                return {
                  ...headers,
                  [SERVER_TIMING_HEADER]: serverTiming
                    .map((entry) => prefixServerTimingEntry(entry, appName))
                    .concat(total)
                    .join(', '),
                };
              default:
                return { ...headers, [SERVER_TIMING_HEADER]: total };
            }
          },
        },
      });
    }
  },
  { fastify: '5', name: 'api-proxy', dependencies: [OBO_ACCESS_TOKEN_PLUGIN_ID, SERVER_TIMING_PLUGIN_ID] },
);

const prefixServerTimingEntry = (entry: string, appName: string): string => {
  const [name, duration, description] = entry.trim().split(';');

  const timing = `${appName}-${name};${duration}`;

  if (description === undefined) {
    return timing;
  }

  const [_, desc] = description.split('=');

  if (desc === undefined) {
    return timing;
  }

  if (desc.startsWith('"') && desc.endsWith('"')) {
    const content = desc.slice(1, -1);

    return `${timing};desc="${content} (${appName})"`;
  }

  return `${timing};desc="${desc} (${appName})"`;
};
