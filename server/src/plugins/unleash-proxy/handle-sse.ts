import { context, propagation, SpanStatusCode, trace } from '@opentelemetry/api';
import type { FastifyReply } from 'fastify';
import { NAIS_APP_NAME, NAIS_POD_NAME } from '@/config/config';
import { getLogger } from '@/logger';
import type { ToggleRequest } from '@/plugins/unleash-proxy/types';
import { UNLEASH_PROXY_URL } from '@/plugins/unleash-proxy/types';
import { tracer } from '@/tracing/tracer';

const log = getLogger('unleash-proxy-plugin');

const HEARTBEAT_INTERVAL_MS = 30_000;

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

  const headers = new Headers({ 'content-type': 'application/json' });

  if (req.query.traceparent !== undefined) {
    headers.set('traceparent', req.query.traceparent);
  }

  const body = JSON.stringify({
    navIdent: req.navIdent,
    appName: NAIS_APP_NAME,
    podName: NAIS_POD_NAME,
  });

  let toggleResponse: Response;

  try {
    toggleResponse = await fetch(`${UNLEASH_PROXY_URL}/${toggle}`, {
      method: 'QUERY',
      headers,
      body,
    });
  } catch (error) {
    log.error({
      msg: 'Unleash proxy SSE fetch failed',
      error,
      data: { sse: true, toggle, tab_id: req.tab_id, client_version: req.client_version },
    });
    span.setStatus({ code: SpanStatusCode.ERROR, message: 'Upstream fetch failed' });
    span.end();

    return reply.status(502).send({ error: 'Failed to fetch feature toggle' });
  }

  span.setAttribute('http.status_code', toggleResponse.status);

  if (!toggleResponse.ok) {
    const statusText = await toggleResponse.text().catch(() => 'unknown');

    log.error({
      msg: 'Unleash proxy SSE request failed',
      data: {
        toggle,
        status: toggleResponse.status,
        statusText,
        tab_id: req.tab_id,
        client_version: req.client_version,
      },
    });

    span.setStatus({ code: SpanStatusCode.ERROR, message: `Upstream responded ${toggleResponse.status}` });
    span.end();

    return reply.status(502).send({ error: 'Failed to fetch feature toggle' });
  }

  const carrier: Record<string, string> = {};
  propagation.inject(trace.setSpan(context.active(), span), carrier);
  const { traceparent = null } = carrier;

  let parsed: unknown;

  try {
    parsed = await toggleResponse.json();
  } catch (error) {
    log.error({
      msg: 'Failed to parse Unleash proxy response',
      error,
      data: { sse: true, toggle, tab_id: req.tab_id, client_version: req.client_version },
    });
    span.setStatus({ code: SpanStatusCode.ERROR, message: 'Failed to parse upstream response' });
    span.end();

    return reply.status(502).send({ error: 'Failed to parse feature toggle response' });
  }

  if (!isUpstreamToggleResponse(parsed)) {
    log.error({
      msg: 'Unexpected Unleash proxy response shape',
      data: { sse: true, toggle, tab_id: req.tab_id, client_version: req.client_version, body: JSON.stringify(parsed) },
    });
    span.setStatus({ code: SpanStatusCode.ERROR, message: 'Unexpected upstream response shape' });
    span.end();

    return reply.status(502).send({ error: 'Unexpected feature toggle response' });
  }

  const heartbeatInterval = setInterval(() => {
    if (reply.raw.destroyed || reply.raw.writableEnded) {
      finishSseConnection();

      return;
    }

    reply.raw.write(': heartbeat\n\n');
  }, HEARTBEAT_INTERVAL_MS);

  const finishSseConnection = (() => {
    let finished = false;

    return () => {
      if (finished) {
        return;
      }

      finished = true;
      clearInterval(heartbeatInterval);
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
      log.debug({ msg: `Feature toggle SSE connection closed for "${toggle}"`, data: { sse: true, toggle } });
    };
  })();

  reply.raw.once('finish', finishSseConnection);
  reply.raw.once('close', finishSseConnection);

  req.socket.once('close', () => {
    if (!req.raw.destroyed) {
      req.raw.destroy();
    }

    finishSseConnection();
  });

  if (req.raw.destroyed) {
    finishSseConnection();

    return;
  }

  reply.hijack();

  reply.raw.writeHead(200, {
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
    connection: 'keep-alive',
  });

  const toggleData: SseToggleEvent = { enabled: parsed.enabled, traceparent };

  reply.raw.write(`event: toggle\ndata: ${JSON.stringify(toggleData)}\n\n`);
};

interface UpstreamToggleResponse {
  enabled: boolean;
}

interface SseToggleEvent extends UpstreamToggleResponse {
  traceparent: string | null;
}

const isUpstreamToggleResponse = (data: unknown): data is UpstreamToggleResponse =>
  data !== null && typeof data === 'object' && 'enabled' in data && typeof data.enabled === 'boolean';
