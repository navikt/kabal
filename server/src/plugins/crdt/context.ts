import type { Span } from '@opentelemetry/api';
import { isObject } from '@/functions/functions';

export interface ConnectionContext {
  readonly behandlingId: string;
  readonly dokumentId: string;
  readonly tab_id?: string;
  readonly client_version: string;
  readonly navIdent: string;
  readonly cookie: string | undefined;
  readonly socket: { close(code?: number, reason?: string): void };
  readonly traceparent?: string;
  hasWriteAccess?: boolean;
  tokenRefreshTimer?: Timer;
  oboTokenExpiresAt?: number;
  removeHasAccessListener?: () => void;
  removeDeletedListener?: () => void;
  /** Current activity window span, started on first message after idle. */
  activitySpan?: Span;
  /** Timer that ends the activity span after a period of inactivity. */
  activityTimer?: Timer;
  /** Number of messages in the current activity window. */
  activityMessageCount?: number;
}

export const isConnectionContext = (data: unknown): data is ConnectionContext =>
  isObject(data) && 'behandlingId' in data && 'dokumentId' in data;

/**
 * Extract the trace ID (32 hex chars) from a W3C traceparent header value.
 * Format: `{version}-{traceId}-{parentId}-{traceFlags}` e.g. `00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01`
 * Returns undefined if the traceparent is missing or malformed.
 */
export const getTraceId = (context: ConnectionContext): string | undefined => {
  const { traceparent } = context;

  if (traceparent === undefined) {
    return undefined;
  }

  const parts = traceparent.split('-');

  if (parts.length < 4) {
    return undefined;
  }

  const traceId = parts[1];

  if (traceId === undefined || traceId.length !== 32) {
    return undefined;
  }

  return traceId;
};
