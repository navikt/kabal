import { randomBytes } from 'node:crypto';
import { getLogger } from '@app/logger';

const log = getLogger('traceparent');

const TRACE_VERSION = '00';
const TRACE_FLAGS = '00';

/** Generates a traceparent ID according to https://www.w3.org/TR/trace-context/#version-format */
export const generateTraceparent = (traceId: string = generateTraceId()): string => {
  const parentId = randomBytes(8).toString('hex');

  return `${TRACE_VERSION}-${traceId}-${parentId}-${TRACE_FLAGS}`;
};

export const generateTraceId = (): string => randomBytes(16).toString('hex');

/** Parses traceId from traceparent ID according to https://www.w3.org/TR/trace-context/#version-format */
export const getTraceIdFromTraceparent = (
  traceparent: string,
  clientVersion: string | undefined,
): string | undefined => {
  const [version, traceId] = traceparent.split('-');

  if (version !== TRACE_VERSION) {
    log.warn({
      msg: `Invalid traceparent version: ${version}`,
      data: { traceparent },
      traceId,
      client_version: clientVersion,
    });
  }

  return traceId;
};
