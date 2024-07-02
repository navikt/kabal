import { getDuration } from '@app/helpers/duration';
import { AnyObject, getLogger } from '@app/logger';
import { PROXY_VERSION_PLUGIN_ID } from '@app/plugins/proxy-version';
import { SERVE_ASSETS_PLUGIN_ID } from '@app/plugins/serve-assets';
import { SERVE_INDEX_PLUGIN_ID } from '@app/plugins/serve-index';
import { TAB_ID_PLUGIN_ID } from '@app/plugins/tab-id';
import fastifyPlugin from 'fastify-plugin';

export const HTTP_LOGGER_PLUGIN_ID = 'http-logger';

export const httpLoggerPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.addHook('onResponse', async (req, res) => {
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
    });

    pluginDone();
  },
  {
    fastify: '4',
    name: HTTP_LOGGER_PLUGIN_ID,
    dependencies: [PROXY_VERSION_PLUGIN_ID, SERVE_INDEX_PLUGIN_ID, SERVE_ASSETS_PLUGIN_ID, TAB_ID_PLUGIN_ID],
  },
);

const httpLogger = getLogger('http');

interface HttpData extends AnyObject {
  method: string;
  url: string;
  statusCode: number;
  traceId: string | undefined;
  client_version: string | undefined;
  tab_id: string | undefined;
  responseTime: number;
}

const logHttpRequest = ({ traceId, client_version, tab_id, ...data }: HttpData) => {
  const msg = `Response ${data.statusCode} ${data.method} ${data.url} ${data.responseTime}ms`;

  if (data.statusCode >= 500) {
    httpLogger.error({ msg, traceId, data, client_version, tab_id });

    return;
  }

  if (data.statusCode >= 400) {
    httpLogger.warn({ msg, traceId, data, client_version, tab_id });

    return;
  }

  httpLogger.debug({ msg, traceId, data, client_version, tab_id });
};
