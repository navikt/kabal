import { ROOT_CONTEXT, type Span, type SpanContext, SpanStatusCode, TraceFlags, trace } from '@opentelemetry/api';
import type { ConnectionContext } from '@/plugins/crdt/context';
import { tracer } from '@/tracing/tracer';

/** Debounce time for HocusPocus store and activity idle timeout (ms). */
export const DEBOUNCE_MS = 3_000;

/** Common attributes attached to every collaboration span. */
const connectionAttributes = (ctx: ConnectionContext): Record<string, string> => ({
  dokument_id: ctx.dokumentId,
  behandling_id: ctx.behandlingId,
  nav_ident: ctx.navIdent,
  client_version: ctx.client_version,
  ...(ctx.tab_id !== undefined ? { tab_id: ctx.tab_id } : {}),
});

const LOWERCASE_HEX = /^[0-9a-f]+$/;
const ZERO_TRACE_ID = '0'.repeat(32);
const ZERO_SPAN_ID = '0'.repeat(16);

/** Parse a W3C traceparent string into a remote SpanContext. */
const parseTraceparent = (traceparent: string): SpanContext | null => {
  const parts = traceparent.split('-');

  if (parts.length < 4) {
    return null;
  }

  const [, traceId, spanId, flags] = parts;

  if (traceId === undefined || spanId === undefined || flags === undefined) {
    return null;
  }

  if (traceId.length !== 32 || spanId.length !== 16 || flags.length !== 2) {
    return null;
  }

  if (!LOWERCASE_HEX.test(traceId) || !LOWERCASE_HEX.test(spanId) || !LOWERCASE_HEX.test(flags)) {
    return null;
  }

  if (traceId === ZERO_TRACE_ID || spanId === ZERO_SPAN_ID) {
    return null;
  }

  const parsed = Number.parseInt(flags, 16);

  return { traceId, spanId, traceFlags: Number.isNaN(parsed) ? TraceFlags.NONE : parsed, isRemote: true };
};

/**
 * Build a parent OTel context from the client traceparent (passed via WebSocket query param,
 * since the browser WebSocket API does not support custom headers).
 *
 * Parses the traceparent directly instead of going through `propagation.extract()`
 * because the global propagator may not survive Bun bundling.
 */
const getParentContext = (ctx: ConnectionContext) => {
  if (ctx.traceparent === undefined) {
    return ROOT_CONTEXT;
  }

  const spanContext = parseTraceparent(ctx.traceparent);

  if (spanContext === null) {
    return ROOT_CONTEXT;
  }

  return trace.setSpanContext(ROOT_CONTEXT, spanContext);
};

/**
 * Wraps an async HocusPocus hook body in a short-lived OTel span.
 * The span name follows the convention: `collaboration.<hookName>`.
 * Uses the client's traceparent to parent spans under the frontend trace.
 */
export const withCollaborationSpan = async <T>(
  hookName: string,
  connCtx: ConnectionContext,
  fn: (span: Span) => Promise<T>,
): Promise<T> => {
  return tracer.startActiveSpan(
    `collaboration.${hookName}`,
    { attributes: connectionAttributes(connCtx) },
    getParentContext(connCtx),
    async (span) => {
      try {
        const result = await fn(span);
        span.setStatus({ code: SpanStatusCode.OK });

        return result;
      } catch (error) {
        span.setStatus({ code: SpanStatusCode.ERROR });

        if (error instanceof Error) {
          span.recordException(error);
        }

        throw error;
      } finally {
        span.end();
      }
    },
  );
};

/**
 * Track user editing activity as windowed spans instead of one span per message.
 *
 * On the first message after idle, starts a `collaboration.activity` span.
 * Each subsequent message increments the message count and resets the idle timer.
 * After {@link DEBOUNCE_MS}ms of inactivity the span ends with the
 * final `message_count` attribute, giving a clear picture of active/inactive periods.
 */
export const trackActivity = (ctx: ConnectionContext, tokenExpiresIn: number, hasWriteAccess: boolean): void => {
  if (ctx.activitySpan === undefined) {
    const span = tracer.startSpan(
      'collaboration.activity',
      { attributes: connectionAttributes(ctx) },
      getParentContext(ctx),
    );

    span.setAttribute('token_expires_in_start', tokenExpiresIn);
    ctx.activitySpan = span;
    ctx.activityMessageCount = 0;
  }

  ctx.activityMessageCount = (ctx.activityMessageCount ?? 0) + 1;
  ctx.activitySpan.setAttribute('token_expires_in', tokenExpiresIn);
  ctx.activitySpan.setAttribute('has_write_access', hasWriteAccess);

  if (ctx.activityTimer !== undefined) {
    clearTimeout(ctx.activityTimer);
  }

  ctx.activityTimer = setTimeout(() => endActivity(ctx), DEBOUNCE_MS);
};

/** End the current activity window span, recording the message count. */
export const endActivity = (ctx: ConnectionContext): void => {
  if (ctx.activityTimer !== undefined) {
    clearTimeout(ctx.activityTimer);
    ctx.activityTimer = undefined;
  }

  if (ctx.activitySpan !== undefined) {
    ctx.activitySpan.setAttribute('message_count', ctx.activityMessageCount ?? 0);
    ctx.activitySpan.setStatus({ code: SpanStatusCode.OK });
    ctx.activitySpan.end();
    ctx.activitySpan = undefined;
    ctx.activityMessageCount = undefined;
  }
};
