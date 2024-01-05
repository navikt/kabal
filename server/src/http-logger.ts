import { performance } from 'perf_hooks';
import { RequestHandler } from 'express';
import { AnyObject, getLogger } from '@app/logger';
import { TRACEPARENT_HEADER, getTraceIdFromTraceparent } from '@app/request-id';

const httpLogger = getLogger('http');

export const httpLoggingMiddleware: RequestHandler = (req, res, next) => {
  const start = performance.now();

  const onEnd = (event: string) => () => {
    const { method, url, headers } = req;

    if (url.endsWith('/isAlive') || url.endsWith('/isReady')) {
      return;
    }

    const { statusCode } = res;

    const responseTime = Math.round(performance.now() - start);
    const traceparentHeader = headers[TRACEPARENT_HEADER];
    const traceparent = Array.isArray(traceparentHeader) ? traceparentHeader[0] : traceparentHeader;
    const traceId = traceparent === undefined ? undefined : getTraceIdFromTraceparent(traceparent);

    logHttpRequest({
      method,
      url,
      statusCode,
      traceId,
      responseTime,
      event,
    });
  };

  res.once('finish', onEnd('finish'));
  res.once('close', onEnd('close'));

  next();
};

interface HttpData extends AnyObject {
  method: string;
  url: string;
  statusCode: number;
  traceId: string | undefined;
  responseTime: number;
  event?: string;
}

const logHttpRequest = ({ traceId, ...data }: HttpData) => {
  const msg = `${data.statusCode} ${data.method} ${data.url}`;

  if (data.statusCode >= 500) {
    httpLogger.error({ msg, traceId, data });

    return;
  }

  if (data.statusCode >= 400) {
    httpLogger.warn({ msg, traceId, data });

    return;
  }

  httpLogger.debug({ msg, traceId, data });
};
