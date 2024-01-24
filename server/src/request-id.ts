import { randomBytes } from 'node:crypto';
import { Request, RequestHandler } from 'express';
import { CLIENT_VERSION_KEY } from '@app/headers';
import { getLogger } from '@app/logger';

const log = getLogger('traceparent');

export const TRACEPARENT_HEADER = 'traceparent';

export const ensureTraceparentHandler: RequestHandler = (req, res, next) => {
  ensureTraceparent(req);
  next();
};

/** Ensure the request has a traceparent header. Returns the `traceId` segment. */
export const ensureTraceparent = (req: Request): string => {
  const traceparentHeader = req.get(TRACEPARENT_HEADER);
  const hasTraceparentHeader = typeof traceparentHeader === 'string' && traceparentHeader.length !== 0;

  // Request has no traceparent header.
  if (!hasTraceparentHeader) {
    const traceparentQuery = req.query[TRACEPARENT_HEADER];
    const hasTraceparentQuery = typeof traceparentQuery === 'string' && traceparentQuery.length !== 0;

    const traceId = generateTraceId();

    const traceparent = hasTraceparentQuery ? traceparentQuery : generateTraceparent(traceId);

    req.headers[TRACEPARENT_HEADER] = traceparent;

    return traceId;
  }

  const parsedTraceId = getTraceIdFromTraceparent(traceparentHeader, req);

  // Request has traceparent header, but it is invalid.
  if (parsedTraceId === undefined) {
    const traceId = generateTraceId();
    const traceparent = generateTraceparent(traceId);

    req.headers[TRACEPARENT_HEADER] = traceparent;

    return traceId;
  }

  return parsedTraceId;
};

const TRACE_VERSION = '00';
const TRACE_FLAGS = '00';

/** Generates a traceparent ID according to https://www.w3.org/TR/trace-context/#version-format */
const generateTraceparent = (traceId: string = generateTraceId()): string => {
  const parentId = randomBytes(8).toString('hex');

  return `${TRACE_VERSION}-${traceId}-${parentId}-${TRACE_FLAGS}`;
};

const generateTraceId = (): string => randomBytes(16).toString('hex');

/** Parses traceId from traceparent ID according to https://www.w3.org/TR/trace-context/#version-format */
export const getTraceIdFromTraceparent = (traceparent: string, req: Request): string | undefined => {
  const [version, traceId] = traceparent.split('-');

  if (version !== TRACE_VERSION) {
    log.warn({
      msg: `Invalid traceparent version: ${version}`,
      data: { traceparent },
      traceId,
      client_version: req.get(CLIENT_VERSION_KEY),
    });
  }

  return traceId;
};
