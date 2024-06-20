import { CompressionStream, CompressionType } from '@app/compression/stream';
import { API_CLIENT_IDS } from '@app/config/config';
import { DEV_URL, isDeployed } from '@app/config/env';
import { getDuration } from '@app/helpers/duration';
import { prepareRequestHeaders } from '@app/helpers/prepare-request-headers';
import { AnyObject, getLogger } from '@app/logger';
import { oboTokenMiddleware } from '@app/middleware/obo-token';
import { Hono, HonoRequest } from 'hono';
import { stream } from 'hono/streaming';
import { setMetric } from 'hono/timing';
import { StatusCode } from 'hono/utils/http-status';

const log = getLogger('proxy');

interface LogData extends AnyObject {
  proxy_target_application: string;
  proxy_target_url: string;
  proxy_target_path: string;
  client_url: string;
  method: string;
  sse: boolean;
  request_content_type: string | null;
  request_content_length: string | null;
  response_content_type?: string | null;
  response_content_length?: string | null;
  status?: number;
  apiCompression?: string | null;
  compression?: string | null;
}

export const setupProxyRoutes = (app: Hono) => {
  for (const appName of API_CLIENT_IDS) {
    const prefix = `/api/${appName}`;
    const route = `${prefix}/*`;

    if (isDeployed) {
      app.use(route, oboTokenMiddleware(appName, route));
    }

    app.all(route, async (context) => {
      const { traceId } = context.var;
      const { pathname, search } = new URL(context.req.url);
      const path = isDeployed ? pathname.replace(prefix, '') : pathname;
      const url = isDeployed ? `http://${appName}${path}${search}` : `${DEV_URL}${path}${search}`;

      const isSSE = context.req.header('accept') === 'text/event-stream';

      const logData: LogData = {
        proxy_target_application: appName,
        proxy_target_url: url,
        proxy_target_path: path,
        client_url: context.req.url,
        method: context.req.method,
        request_content_type: context.req.header('content-type') ?? null,
        request_content_length: context.req.header('content-length') ?? null,
        sse: isSSE,
      };

      if (isSSE) {
        log.debug({ msg: 'Proxying SSE connection', traceId, data: logData });
      } else {
        log.debug({ msg: 'Proxying request', traceId, data: logData });
      }

      const proxyReq = new Request({ ...context.req.raw, url }, { headers: prepareRequestHeaders(context, appName) });

      log.debug({ msg: 'Proxy request sent', traceId, data: logData });

      const proxyReqStart = performance.now();

      try {
        const proxyRes = await fetch(proxyReq, { redirect: 'manual' });

        setMetric(context, 'proxy_target_response_time', getDuration(proxyReqStart), `Waiting for ${appName}`);

        const resContentType = proxyRes.headers.get('content-type');
        const resContentLength = proxyRes.headers.get('content-length');

        logData.response_content_type = resContentType;
        logData.response_content_length = resContentLength;
        logData.status = proxyRes.status;

        const apiCompression = proxyRes.headers.get('content-encoding');
        logData.apiCompression = apiCompression;

        const isProxyResCompressed =
          apiCompression === null ? false : COMPRESSION_ALGORITHMS.some((a) => a === apiCompression);
        const preferredCompression = getPreferredCompression(context.req);

        logData.compression =
          preferredCompression === null ? null : COMPRESSION_TYPE_TO_ALGORITHM[preferredCompression];

        const compressionStream = getCompressionStream(
          resContentType,
          resContentLength,
          isProxyResCompressed,
          preferredCompression,
        );

        log.debug({
          msg: 'Proxy response received',
          traceId,
          data: { ...logData, duration: getDuration(proxyReqStart) },
        });

        const { body } = proxyRes;

        proxyRes.headers.forEach((value, key) => {
          if (key === 'content-encoding' || key === 'content-length') {
            return;
          }

          context.header(key, value);
        });

        context.status(proxyRes.status as StatusCode);

        if (compressionStream !== null && preferredCompression !== null) {
          context.header('content-encoding', COMPRESSION_TYPE_TO_ALGORITHM[preferredCompression]);
        }

        if (resContentLength === '0') {
          context.header('content-length', '0');

          return context.body(null);
        }

        const streamStart = performance.now();

        return stream(context, async (responseStream) => {
          if (body !== null) {
            if (compressionStream !== null) {
              await responseStream.pipe(body.pipeThrough(compressionStream));
            } else {
              await responseStream.pipe(body);
            }
          }

          await responseStream.close();

          log.debug({
            msg: 'Proxy response stream done',
            traceId,
            data: { ...logData, duration: getDuration(streamStart) },
          });
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          log.debug({
            msg: 'Proxy request aborted',
            traceId,
            data: { ...logData, duration: getDuration(proxyReqStart) },
          });

          return;
        }

        log.error({
          msg: 'Failed to proxy request',
          error,
          traceId,
          data: { ...logData, duration: getDuration(proxyReqStart) },
        });

        return context.text('Failed to proxy request', 500);
      }
    });
  }
};

enum CompressionAlgorithm {
  BROTLI = 'br',
  GZIP = 'gzip',
  DEFLATE = 'deflate',
}

const COMPRESSION_ALGORITHMS = Object.values(CompressionAlgorithm);

const createCompressionStream = (preferredCompression: CompressionType): CompressionStream => {
  switch (preferredCompression) {
    case CompressionType.BROTLI:
      return new CompressionStream(CompressionType.BROTLI);
    case CompressionType.GZIP:
      return new CompressionStream(CompressionType.GZIP);
    case CompressionType.DEFLATE:
      return new CompressionStream(CompressionType.DEFLATE);
  }
};

const getPreferredCompression = (req: HonoRequest): CompressionType | null => {
  const acceptEncoding = req.header('accept-encoding');

  if (acceptEncoding === undefined || acceptEncoding.length === 0) {
    return null;
  }

  const encodings = acceptEncoding
    .split(',')
    .map((e) => e.trim().split(';')[0])
    .filter((e): e is string => e !== undefined && e.length > 0);

  if (encodings.includes(CompressionAlgorithm.BROTLI) || encodings.includes('*')) {
    return CompressionType.BROTLI;
  }

  if (encodings.includes(CompressionAlgorithm.GZIP)) {
    return CompressionType.GZIP;
  }

  if (encodings.includes(CompressionAlgorithm.DEFLATE)) {
    return CompressionType.DEFLATE;
  }

  return null;
};

const COMPRESSION_TYPE_TO_ALGORITHM: Record<CompressionType, CompressionAlgorithm> = {
  [CompressionType.BROTLI]: CompressionAlgorithm.BROTLI,
  [CompressionType.GZIP]: CompressionAlgorithm.GZIP,
  [CompressionType.DEFLATE]: CompressionAlgorithm.DEFLATE,
};

const getCompressionStream = (
  contentType: string | null,
  contentLength: string | null,
  isProxyResCompressed: boolean,
  preferredCompression: CompressionType | null,
): CompressionStream | null => {
  if (preferredCompression === null || contentLength === '0' || contentType === null) {
    return null;
  }

  if (isProxyResCompressed) {
    return createCompressionStream(preferredCompression);
  }

  if (
    contentType.endsWith('/pdf') ||
    contentType.startsWith('image/') ||
    contentType.startsWith('video/') ||
    contentType.startsWith('audio/')
  ) {
    return null;
  }

  if (contentLength === null) {
    return createCompressionStream(preferredCompression);
  }

  const bytes = Number.parseInt(contentLength, 10);

  if (Number.isNaN(bytes) || bytes === 0) {
    return null;
  }

  if (bytes < 4096) {
    return null;
  }

  return createCompressionStream(preferredCompression);
};
