import { SpanStatusCode } from '@opentelemetry/api';
import type { FastifyReply } from 'fastify';
import { NAIS_APP_NAME, NAIS_POD_NAME } from '@/config/config';
import { getLogger } from '@/logger';
import type { ToggleRequest } from '@/plugins/unleash-proxy/types';
import { UNLEASH_PROXY_URL } from '@/plugins/unleash-proxy/types';
import { tracer } from '@/tracing/tracer';

const log = getLogger('unleash-proxy-plugin');

export const handleSse = async (req: ToggleRequest, reply: FastifyReply) => {
  const { toggle } = req.params;

  const span = tracer.startSpan('unleash.sse_stream', {
    attributes: {
      toggle,
      nav_ident: req.navIdent,
      tab_id: req.tab_id ?? '',
      client_version: req.client_version ?? '',
    },
  });

  log.debug({ msg: `Feature toggle SSE connection opened for "${toggle}"`, data: { sse: true, toggle } });

  const body = JSON.stringify({
    navIdent: req.navIdent,
    appName: NAIS_APP_NAME,
    podName: NAIS_POD_NAME,
  });

  const headers = new Headers({ 'content-type': 'application/json', accept: 'text/event-stream' });

  if (req.query.traceparent !== undefined) {
    headers.set('traceparent', req.query.traceparent);
  }

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(`${UNLEASH_PROXY_URL}/${toggle}`, {
      method: 'QUERY',
      headers,
      body,
    });
  } catch (error) {
    log.error({ msg: 'Unleash proxy SSE fetch failed', error, data: { sse: true, toggle } });
    span.setStatus({ code: SpanStatusCode.ERROR, message: 'Upstream fetch failed' });
    span.end();

    return reply.status(502).send({ error: 'Failed to open upstream feature toggle stream' });
  }

  if (!upstreamResponse.ok || upstreamResponse.body === null) {
    const statusText = await upstreamResponse.text().catch(() => 'unknown');

    log.error({
      msg: 'Unleash proxy SSE request failed',
      data: { toggle, status: upstreamResponse.status, statusText },
    });

    span.setStatus({ code: SpanStatusCode.ERROR, message: `Upstream responded ${upstreamResponse.status}` });
    span.end();

    return reply.status(502).send({ error: 'Failed to open upstream feature toggle stream' });
  }

  span.setAttribute('http.status_code', upstreamResponse.status);

  reply.hijack();

  reply.raw.writeHead(200, {
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
    connection: 'keep-alive',
  });

  const reader = upstreamResponse.body.getReader();

  req.socket.once('close', () => {
    reader.cancel().catch(() => undefined);
    log.debug({ msg: `Feature toggle SSE connection closed for "${toggle}"`, data: { sse: true, toggle } });
  });

  try {
    for (;;) {
      const { done, value } = await reader.read();

      if (done) {
        span.setStatus({ code: SpanStatusCode.OK });
        break;
      }

      reply.raw.write(value);
    }
  } catch (error) {
    log.error({ msg: `Feature toggle SSE read error for "${toggle}"`, error, data: { sse: true, toggle } });
    span.setStatus({ code: SpanStatusCode.ERROR, message: 'Upstream read failed' });
  } finally {
    reader.cancel().catch(() => undefined);
    reply.raw.end();
    span.end();
  }
};
