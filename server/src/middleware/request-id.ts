import { MiddlewareHandler } from 'hono';
import { generateTraceId, generateTraceparent, getTraceIdFromTraceparent } from '@app/helpers/traceparent';

export const TRACEPARENT_HEADER = 'traceparent';
export const TRACEPARENT_QUERY = 'traceparent';

export const traceIdAndParentToContext: MiddlewareHandler = async (context, next) => {
  const traceparentHeader = context.req.header(TRACEPARENT_HEADER);

  if (typeof traceparentHeader === 'string' && traceparentHeader.length !== 0) {
    const traceId = getTraceIdFromTraceparent(traceparentHeader, context);

    if (traceId !== undefined) {
      context.set('traceparent', traceparentHeader);
      context.set('traceId', traceId);

      return await next();
    }
  }

  const traceparentQuery = context.req.query(TRACEPARENT_QUERY);

  if (typeof traceparentQuery === 'string' && traceparentQuery.length !== 0) {
    const traceId = getTraceIdFromTraceparent(traceparentQuery, context);

    if (traceId !== undefined) {
      context.set('traceparent', traceparentQuery);
      context.set('traceId', traceId);

      return await next();
    }
  }

  const traceId = generateTraceId();
  const traceparent = generateTraceparent(traceId);

  context.set('traceparent', traceparent);
  context.set('traceId', traceId);

  return await next();
};
