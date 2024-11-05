import {
  generateSpanId,
  generateTraceId,
  generateTraceparent,
  getTraceIdAndSpanIdFromTraceparent,
} from '@app/helpers/traceparent';
import type { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    traceparent: string;
    trace_id: string;
    span_id: string;
  }
}

export const TRACEPARENT_PLUGIN_ID = 'traceparent';

export const traceparentPlugin = fastifyPlugin(
  async (app) => {
    app.decorateRequest('traceparent', '');
    app.decorateRequest('trace_id', '');
    app.decorateRequest('span_id', '');

    // biome-ignore lint/suspicious/useAwait: Needs to return a promise
    app.addHook('preHandler', async (req: FastifyRequest<{ Querystring: Record<string, string | undefined> }>) => {
      const { trace_id, span_id, traceparent } = getTraceIdAndSpanId(req);
      req.trace_id = trace_id;
      req.span_id = span_id;
      req.traceparent = traceparent;
    });
  },
  { fastify: '5', name: TRACEPARENT_PLUGIN_ID },
);

const TRACEPARENT_HEADER = 'traceparent';
const TRACEPARENT_QUERY = 'traceparent';

const getTraceIdAndSpanId = ({
  headers,
  query,
  client_version: clientVersion,
}: FastifyRequest<{ Querystring: Record<string, string | undefined> }>) => {
  const traceparentHeader = headers[TRACEPARENT_HEADER];

  if (typeof traceparentHeader === 'string' && traceparentHeader.length > 0) {
    const { trace_id, span_id } = getTraceIdAndSpanIdFromTraceparent(traceparentHeader, clientVersion);

    if (trace_id !== undefined && span_id !== undefined) {
      return { trace_id, span_id, traceparent: traceparentHeader };
    }
  }

  const traceparentQuery = query[TRACEPARENT_QUERY];

  if (typeof traceparentQuery === 'string' && traceparentQuery.length > 0) {
    const { trace_id, span_id } = getTraceIdAndSpanIdFromTraceparent(traceparentQuery, clientVersion);

    if (trace_id !== undefined && span_id !== undefined) {
      return { trace_id, span_id, traceparent: traceparentQuery };
    }
  }

  const trace_id = generateTraceId();
  const span_id = generateSpanId();
  const traceparent = generateTraceparent(trace_id, span_id);

  return { trace_id, span_id, traceparent };
};
