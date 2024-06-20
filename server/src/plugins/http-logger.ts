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

      const { trace_id, span_id, client_version, tab_id, startTime } = req;

      const responseTime = getDuration(startTime);

      logHttpRequest({
        method: req.method,
        url,
        status_code: res.statusCode,
        trace_id,
        span_id,
        client_version,
        tab_id,
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
  status_code: number;
  trace_id: string | undefined;
  span_id: string | undefined;
  client_version: string | undefined;
  tab_id: string | undefined;
  responseTime: number;
}

const logHttpRequest = ({ trace_id, span_id, client_version, tab_id, ...data }: HttpData) => {
  const msg = `Response ${data.status_code} ${data.method} ${data.url} ${data.responseTime}ms`;

  if (data.status_code >= 500) {
    httpLogger.error({ msg, trace_id, span_id, data, client_version, tab_id });

    return;
  }

  if (data.status_code >= 400) {
    httpLogger.warn({ msg, trace_id, span_id, data, client_version, tab_id });

    return;
  }

  httpLogger.debug({ msg, trace_id, span_id, data, client_version, tab_id });
};
