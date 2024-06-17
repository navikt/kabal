import { CompressionStream, CompressionType } from '@app/compression/stream';
import { API_CLIENT_IDS } from '@app/config/config';
import { DEV_URL, isDeployed } from '@app/config/env';
import { getDuration } from '@app/helpers/duration';
import { prepareRequestHeaders } from '@app/helpers/prepare-request-headers';
import { getLogger } from '@app/logger';
import { oboTokenMiddleware } from '@app/middleware/obo-token';
import { Hono, HonoRequest } from 'hono';
import { stream } from 'hono/streaming';
import { setMetric } from 'hono/timing';
import { StatusCode } from 'hono/utils/http-status';

const log = getLogger('proxy');

export const setupProxyRoutes = (server: Hono) => {
  API_CLIENT_IDS.forEach((appName) => {
    const prefix = `/api/${appName}`;
    const route = `${prefix}/*`;

    server.use(route, oboTokenMiddleware(appName, route));

    server.use(route, async (context) => {
      const { traceId } = context.var;
      const { pathname, search } = new URL(context.req.url);
      const path = isDeployed ? pathname.replace(prefix, '') : pathname;
      const url = isDeployed ? `http://${appName}${path}${search}` : `${DEV_URL}${path}${search}`;

      const isSSE = context.req.header('accept') === 'text/event-stream';

      const logData = {
        proxy_target_application: appName,
        proxy_target_url: url,
        proxy_target_path: path,
        client_url: context.req.url,
        method: context.req.method,
        request_content_type: context.req.header('content-type'),
        request_content_length: context.req.header('content-length'),
        sse: isSSE,
      };

      if (isSSE) {
        log.debug({ msg: 'Proxying SSE connection', traceId, data: logData });
      } else {
        log.debug({ msg: 'Proxying request', traceId, data: logData });
      }

      const proxyReq = new Request(url, {
        headers: prepareRequestHeaders(context, appName),
        method: context.req.method,
        credentials: context.req.raw.credentials,
        keepalive: context.req.raw.keepalive,
        mode: context.req.raw.mode,
        body: await context.req.raw.blob(),
        integrity: context.req.raw.integrity,
      });

      log.debug({ msg: 'Proxy request sent', traceId, data: logData });

      const abortController = new AbortController();

      const abortRequest = () => {
        log.debug({ msg: 'Proxy request aborted by client', traceId, data: logData });
        abortController.abort();
      };

      context.req.raw.signal.addEventListener('abort', abortRequest);
      context.req.raw.signal.addEventListener('close', abortRequest);

      proxyReq.signal.addEventListener('close', () => {
        log.debug({ msg: 'Proxy request closed', traceId, data: { ...logData, duration: getDuration(proxyReqStart) } });
      });

      proxyReq.signal.addEventListener('abort', () => {
        log.debug({
          msg: 'Proxy request aborted',
          traceId,
          data: { ...logData, duration: getDuration(proxyReqStart) },
        });
      });

      const proxyReqStart = performance.now();

      try {
        const proxyRes = await fetch(proxyReq, { signal: abortController.signal, redirect: 'manual' });

        setMetric(context, 'proxy_target_response_time', getDuration(proxyReqStart), appName);

        const apiCompression = proxyRes.headers.get('content-encoding');

        log.debug({
          msg: 'Proxy response received',
          traceId,
          data: { ...logData, status: proxyRes.status, duration: getDuration(proxyReqStart), apiCompression },
        });

        const { body } = proxyRes;

        if (body === null) {
          log.error({
            msg: 'Failed to connect to API. Response body is missing',
            traceId,
            data: { ...logData, status: proxyRes.status, duration: getDuration(proxyReqStart), apiCompression },
          });

          return context.text('Failed to connect to API. Response body is missing', 500);
        }

        const streamStart = performance.now();

        proxyRes.headers.forEach((value, key) => {
          context.header(key, value);
        });

        context.status(proxyRes.status as StatusCode);

        const isProxyResCompressed =
          apiCompression === null ? false : COMPRESSION_ALGORITHMS.some((a) => a === apiCompression);

        const { compression, compressor } = isProxyResCompressed ? getCompression(context.req) : NO_COMPRESSION;

        if (compression !== null) {
          context.header('content-encoding', compression);
        }

        return stream(context, async (responseStream) => {
          responseStream.onAbort(() => {
            log.debug({
              msg: 'Proxy response stream aborted',
              traceId,
              data: {
                ...logData,
                status: proxyRes.status,
                duration: getDuration(proxyReqStart),
                apiCompression,
                compression,
              },
            });
          });

          if (compressor !== null) {
            await responseStream.pipe(body.pipeThrough(compressor));
          } else {
            await responseStream.pipe(body);
          }

          setMetric(context, 'proxy_response_stream_time', getDuration(streamStart), 'Response Stream Time');

          await responseStream.close();

          log.debug({
            msg: 'Proxy response stream done',
            traceId,
            data: {
              ...logData,
              status: proxyRes.status,
              duration: getDuration(streamStart),
              apiCompression,
              compression,
            },
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
  });
};

enum CompressionAlgorithm {
  BROTLI = 'br',
  GZIP = 'gzip',
  DEFLATE = 'deflate',
}

const COMPRESSION_ALGORITHMS = Object.values(CompressionAlgorithm);

interface Compression {
  compression: CompressionAlgorithm;
  compressor: CompressionStream;
}

interface NoCompression {
  compression: null;
  compressor: null;
}

const NO_COMPRESSION: NoCompression = { compression: null, compressor: null };

const getCompression = (req: HonoRequest): Compression | NoCompression => {
  const acceptEncoding = req.header('accept-encoding');

  if (acceptEncoding === undefined || acceptEncoding.length === 0) {
    return NO_COMPRESSION;
  }

  if (acceptEncoding.includes(CompressionAlgorithm.BROTLI)) {
    return { compression: CompressionAlgorithm.BROTLI, compressor: new CompressionStream(CompressionType.BROTLI) };
  }

  if (acceptEncoding.includes(CompressionAlgorithm.GZIP)) {
    return { compression: CompressionAlgorithm.GZIP, compressor: new CompressionStream(CompressionType.GZIP) };
  }

  if (acceptEncoding.includes(CompressionAlgorithm.DEFLATE)) {
    return {
      compression: CompressionAlgorithm.DEFLATE,
      compressor: new CompressionStream(CompressionType.DEFLATE),
    };
  }

  return NO_COMPRESSION;
};
