import { randomBytes } from 'node:crypto';
import { getLogger } from '@app/logger';

const log = getLogger('traceparent');

const TRACE_VERSION = '00';
const TRACE_FLAGS = '00';

/** Generates a traceparent ID according to https://www.w3.org/TR/trace-context/#version-format
 * `span_id` is referred to as `parent_id` in the spec.
 */
export const generateTraceparent = (trace_id: string = generateTraceId(), span_id: string = generateSpanId()): string =>
  `${TRACE_VERSION}-${trace_id}-${span_id}-${TRACE_FLAGS}`;

export const generateSpanId = (): string => randomBytes(8).toString('hex');
export const generateTraceId = (): string => randomBytes(16).toString('hex');

/** Parses traceId from traceparent ID according to https://www.w3.org/TR/trace-context/#version-format */
export const getTraceIdAndSpanIdFromTraceparent = (
  traceparent: string,
  client_version?: string,
): { trace_id: string | undefined; span_id: string | undefined } => {
  const [version, trace_id, span_id] = traceparent.split('-');

  if (version !== TRACE_VERSION) {
    log.warn({
      msg: `Invalid traceparent version: ${version}`,
      data: { traceparent },
      trace_id,
      span_id,
      client_version,
    });
  }

  return { trace_id, span_id };
};
