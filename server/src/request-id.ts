import { randomBytes } from 'node:crypto';
import { RequestHandler } from 'express';
import { getLogger } from '@app/logger';

const log = getLogger('traceparent');

export const ensureTraceparent: RequestHandler = (req, res, next) => {
  const traceparentHeader = req.headers[TRACEPARENT_HEADER];

  if (typeof traceparentHeader === 'undefined' || traceparentHeader.length === 0) {
    const { traceparent } = generateTraceparent();
    req.headers[TRACEPARENT_HEADER] = traceparent;
  }

  next();
};

const TRACE_VERSION = '00';
const TRACE_FLAGS = '00';

/** Generates a traceparent ID according to https://www.w3.org/TR/trace-context/#version-format */
const generateTraceparent = (): { traceparent: string; traceId: string } => {
  const traceId = randomBytes(16).toString('hex');
  const parentId = randomBytes(8).toString('hex');

  return { traceparent: `${TRACE_VERSION}-${traceId}-${parentId}-${TRACE_FLAGS}`, traceId };
};

/** Parses traceId from traceparent ID according to https://www.w3.org/TR/trace-context/#version-format */
export const getTraceIdFromTraceparent = (traceparent: string): string => {
  const [version, traceId] = traceparent.split('-');

  if (version !== TRACE_VERSION) {
    log.warn({ msg: `Invalid traceparent version: ${version}`, data: { traceparent }, traceId });
  }

  return traceId;
};

export const TRACEPARENT_HEADER = 'traceparent';
