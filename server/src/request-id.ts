import { IncomingMessage } from 'http';
import { randomBytes } from 'node:crypto';
import { Request, RequestHandler } from 'express';
import { ParsedQs } from 'qs';
import { CLIENT_VERSION_KEY } from '@app/headers';
import { getLogger } from '@app/logger';

const log = getLogger('traceparent');

export const TRACEPARENT_HEADER = 'traceparent';

export const ensureTraceparentHandler: RequestHandler = (req, _, next) => {
  ensureTraceparent(req);
  next();
};

const getTraceparentAndId = (req: Request | IncomingMessage): [string, string] => {
  if ('query' in req) {
    const traceparentQuery = req.query[TRACEPARENT_HEADER];

    return getTraceparentFromQuery(traceparentQuery);
  }

  if (req.url === undefined) {
    return [generateTraceId(), generateTraceparent()];
  }

  const [, traceparentQuery] = req.url.split('?');

  return getTraceparentFromQuery(traceparentQuery);
};

const getTraceparentFromQuery = (
  traceparentQuery: ParsedQs | ParsedQs[] | string[] | string | undefined,
): [string, string] => {
  const hasTraceparentQuery = typeof traceparentQuery === 'string' && traceparentQuery.length !== 0;
  const traceId = generateTraceId();
  const traceparent = hasTraceparentQuery ? traceparentQuery : generateTraceparent(traceId);

  return [traceId, traceparent];
};

/** Ensure the request has a traceparent header. Returns the `traceId` segment. */
export const ensureTraceparent = (req: Request | IncomingMessage): string => {
  const traceparentHeader = req.headers[TRACEPARENT_HEADER];
  const hasTraceparentHeader = typeof traceparentHeader === 'string' && traceparentHeader.length !== 0;

  // Request has no traceparent header.
  if (!hasTraceparentHeader) {
    const [traceId, traceparent] = getTraceparentAndId(req);

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
export const getTraceIdFromTraceparent = (traceparent: string, req: Request | IncomingMessage): string | undefined => {
  const [version, traceId] = traceparent.split('-');

  if (version !== TRACE_VERSION) {
    log.warn({
      msg: `Invalid traceparent version: ${version}`,
      data: { traceparent },
      traceId,
      client_version: req.headers[CLIENT_VERSION_KEY]?.toString(),
    });
  }

  return traceId;
};
