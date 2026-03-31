import fastifyPlugin from 'fastify-plugin';
import { getDuration } from '@/helpers/duration';
import { type AnyObject, getLogger } from '@/logger';
import { PROXY_VERSION_PLUGIN_ID } from '@/plugins/proxy-version';
import { SERVE_INDEX_PLUGIN_ID } from '@/plugins/serve-index';
import { TAB_ID_PLUGIN_ID } from '@/plugins/tab-id';

export const HTTP_LOGGER_PLUGIN_ID = 'http-logger';

export const httpLoggerPlugin = fastifyPlugin(
  async (app) => {
    app.addHook('onResponse', async (req, res) => {
      const { url } = req;

      if (url.endsWith('/isAlive') || url.endsWith('/isStarted') || url.endsWith('/metrics')) {
        return;
      }

      const { client_version, tab_id, startTime } = req;

      const responseTime = getDuration(startTime);

      logHttpRequest({
        method: req.method,
        url,
        status_code: res.statusCode,
        client_version,
        tab_id,
        responseTime,
        request_content_length: req.headers['content-length'],
        request_content_type: req.headers['content-type'],
        response_content_length: res.getHeader('content-length'),
        response_content_type: res.getHeader('content-type'),
      });
    });
  },
  {
    fastify: '5',
    name: HTTP_LOGGER_PLUGIN_ID,
    dependencies: [PROXY_VERSION_PLUGIN_ID, SERVE_INDEX_PLUGIN_ID, TAB_ID_PLUGIN_ID],
  },
);

const httpLogger = getLogger('http');

interface HttpData extends AnyObject {
  method: string;
  url: string;
  status_code: number;
  client_version: string | undefined;
  tab_id: string | undefined;
  responseTime: number;
}

const logHttpRequest = ({ client_version, tab_id, ...data }: HttpData) => {
  const msg = `Response ${data.status_code} ${data.method} ${data.url} ${data.responseTime}ms`;

  if (data.status_code >= 500) {
    httpLogger.error({ msg, data, client_version, tab_id });

    return;
  }

  if (data.status_code >= 400) {
    httpLogger.warn({ msg, data, client_version, tab_id });

    return;
  }

  httpLogger.debug({ msg, data, client_version, tab_id });
};
