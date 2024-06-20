import { performance } from 'perf_hooks';
import { AnyObject, getLogger } from '@app/logger';
import { MiddlewareHandler } from 'hono';
import { getDuration } from '@app/helpers/duration';

const httpLogger = getLogger('http');

export const httpLoggingMiddleware: MiddlewareHandler = async (context, next) => {
  const start = performance.now();

  await next();

  const { method, url, path } = context.req;

  if (path.endsWith('/isAlive') || path.endsWith('/isReady') || path.endsWith('/metrics')) {
    return;
  }

  const { status } = context.res;

  const responseTime = getDuration(start);

  const { traceId, clientVersion, tabId } = context.var;

  logHttpRequest({
    method,
    url,
    statusCode: status,
    traceId,
    client_version: clientVersion,
    tab_id: tabId,
    responseTime,
    request_content_length: context.req.header('content-length'),
    request_content_type: context.req.header('content-type'),
    event: 'close',
  });
};

interface HttpData extends AnyObject {
  method: string;
  url: string;
  statusCode: number;
  traceId: string | undefined;
  client_version: string | undefined;
  tab_id: string | undefined;
  responseTime: number;
  event?: string;
}

const logHttpRequest = ({ traceId, client_version, tab_id, ...data }: HttpData) => {
  const msg = `${data.statusCode} ${data.method} ${data.url}`;

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
