import { PROXY_VERSION } from '@app/config/config';
import { formatDuration, getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { startClientSession } from '@app/plugins/version/clients-gauge';
import { VERSION_QUERY_STRING_SCHEMA, type VersionQueryString } from '@app/plugins/version/query';
import { histogram } from '@app/plugins/version/session-histogram';
import { getUpdateRequest } from '@app/plugins/version/update-request';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('version');

const RETRY_DELAY = 5_000;

export const versionPlugin = fastifyPlugin(
  async (app) => {
    const RETRY_SSE = `retry: ${RETRY_DELAY}\n\n`;
    const VERSION_SSE = formatSseEvent(EventNames.SERVER_VERSION, PROXY_VERSION);

    app.get<{ Querystring: VersionQueryString }>(
      '/version',
      { schema: { querystring: VERSION_QUERY_STRING_SCHEMA } },
      async (req, reply) => {
        const { trace_id, span_id } = req;

        if (req.headers.accept !== 'text/event-stream') {
          log.warn({
            msg: `Version endpoint called with unsupported accept header "${req.headers.accept}"`,
            trace_id,
            span_id,
            data: { sse: true, accept: req.headers.accept },
          });

          return reply.status(415).send('This endpoint only accepts text/event-stream requests.');
        }

        const start = performance.now();

        log.debug({ msg: 'Version connection opened', trace_id, span_id, data: { sse: true } });

        const stopTimer = histogram.startTimer();
        const endClientSession = startClientSession(req);

        const onClose = () => {
          stopTimer();
          endClientSession();

          req.raw.destroy();
        };

        new Promise<string>((resolve) => {
          req.socket.once('close', () => resolve('req.socket.once(close)'));
        })
          .then((reason) => {
            onClose();

            const duration = getDuration(start);

            log.debug({
              msg: `Version connection closed after ${formatDuration(duration)} (${reason})`,
              trace_id,
              span_id,
              data: { sse: true, duration, reason },
            });

            return reason;
          })
          .catch((error) => {
            log.error({
              msg: 'Error during version connection close',
              trace_id,
              span_id,
              error,
              data: { sse: true },
            });
            onClose();
          });

        if (reply.raw.headersSent) {
          log.warn({ msg: 'Version connection opened after headers sent', trace_id, span_id, data: { sse: true } });

          return;
        }

        reply.raw.writeHead(200, {
          'content-type': 'text/event-stream',
          'cache-control': 'no-cache',
          connection: 'keep-alive',
        });

        reply.raw.write(RETRY_SSE);
        reply.raw.write(VERSION_SSE);
        reply.raw.write(formatSseEvent(EventNames.UPDATE_REQUEST, getUpdateRequest(req)));
      },
    );
  },
  { fastify: '5', name: 'version' },
);

enum EventNames {
  SERVER_VERSION = 'version',
  UPDATE_REQUEST = 'update-request',
}

const formatSseEvent = (event: EventNames, data: string) => `event: ${event}\ndata: ${data}\n\n`;
