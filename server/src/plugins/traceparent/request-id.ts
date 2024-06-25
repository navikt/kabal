import { generateTraceId, generateTraceparent, getTraceIdFromTraceparent } from '@app/helpers/traceparent';
import { FastifyRequest } from 'fastify';

export const TRACEPARENT_HEADER = 'traceparent';
export const TRACEPARENT_QUERY = 'traceparent';

export const traceIdAndParentToContext = ({
  headers,
  query,
  clientVersion,
}: FastifyRequest<{ Querystring: Record<string, string | undefined> }>) => {
  const traceparentHeader = headers[TRACEPARENT_HEADER];

  if (typeof traceparentHeader === 'string' && traceparentHeader.length !== 0) {
    const traceId = getTraceIdFromTraceparent(traceparentHeader, clientVersion);

    if (traceId !== undefined) {
      return { traceId, traceparent: traceparentHeader };
    }
  }

  const traceparentQuery = query[TRACEPARENT_QUERY];

  if (typeof traceparentQuery === 'string' && traceparentQuery.length !== 0) {
    const traceId = getTraceIdFromTraceparent(traceparentQuery, clientVersion);

    if (traceId !== undefined) {
      return { traceparent: traceparentQuery, traceId };
    }
  }

  const traceId = generateTraceId();
  const traceparent = generateTraceparent(traceId);

  return { traceId, traceparent };
};
