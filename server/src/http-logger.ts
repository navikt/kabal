import { performance } from 'perf_hooks';
import { RequestHandler } from 'express';
import { CLIENT_VERSION_KEY, TAB_ID_KEY } from '@app/headers';
import { AnyObject, getLogger } from '@app/logger';
import { TRACEPARENT_HEADER, getTraceIdFromTraceparent } from '@app/request-id';

const httpLogger = getLogger('http');

export const httpLoggingMiddleware: RequestHandler = (req, res, next) => {
  const start = performance.now();

  res.once('close', () => {
    const { method, url, path } = req;

    if (path.endsWith('/isAlive') || path.endsWith('/isReady') || path.endsWith('/metrics')) {
      return;
    }

    const { statusCode } = res;

    const responseTime = Math.round(performance.now() - start);
    const traceparent = req.get(TRACEPARENT_HEADER);
    const traceId = traceparent === undefined ? undefined : getTraceIdFromTraceparent(traceparent, req);

    logHttpRequest({
      method,
      url,
      statusCode,
      traceId,
      client_version: req.get(CLIENT_VERSION_KEY),
      tab_id: req.get(TAB_ID_KEY),
      responseTime,
      request_content_length: req.get('content-length'),
      event: 'close',
    });
  });

  next();
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
