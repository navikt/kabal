import { PROXY_VERSION } from '@app/config/config';
import { formatDuration, getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { histogram } from '@app/plugins/version/session-histogram';
import { startUserSession, stopTimerList } from '@app/plugins/version/unique-users-gauge';
import { getUpdateRequest } from '@app/plugins/version/update-request';
import { ReadableStream } from 'node:stream/web';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('version');

export const versionPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.get('/version', async (req, reply) => {
      if (req.headers['accept'] !== 'text/event-stream') {
        return reply.redirect('/', 307);
      }

      const start = performance.now();

      const { traceId } = req;

      log.debug({ msg: 'Version connection opened', traceId, data: { sse: true } });

      const stopTimer = histogram.startTimer();
      const stopTimerIndex = stopTimerList.push(stopTimer) - 1;
      const endUserSession = startUserSession(req);

      const onClose = () => {
        stopTimerList.splice(stopTimerIndex, 1);
        stopTimer();
        endUserSession();

        req.raw.destroy();
        reply.raw.destroy();
        req.raw.socket.destroy();
        reply.raw.socket?.destroy();
      };

      new Promise<string>((resolve) => {
        req.socket.once('close', () => resolve('req.socket.on(close)'));
        req.raw.once('close', () => resolve('req.raw.on(close)'));
        req.raw.socket.once('close', () => resolve('req.socket.on(close)'));
        reply.raw.socket?.once('close', () => resolve('res.socket.on(close)'));
      }).then((reason) => {
        onClose();

        const duration = getDuration(start);

        log.debug({
          msg: `Version connection closed after ${formatDuration(duration)} (${reason})`,
          traceId,
          data: { sse: true, duration, reason },
        });

        return reason;
      });

      if (reply.raw.headersSent) {
        log.warn({ msg: 'Version connection opened after headers sent', traceId, data: { sse: true } });

        return;
      }

      const events: string = [
        formatSseEvent({ event: EventNames.SERVER_VERSION, data: PROXY_VERSION, retry: 0 }),
        formatSseEvent({ event: EventNames.UPDATE_REQUEST, data: getUpdateRequest(req), retry: 0 }),
      ].join('');

      const stream = new ReadableStream({
        type: 'bytes',
        start(controller) {
          new TextEncoder().encode(events).forEach((byte) => controller.enqueue(Uint8Array.of(byte)));
        },
      });

      const response = new Response(stream, {
        status: 200,
        headers: {
          'content-type': 'text/event-stream',
          'cache-control': 'no-cache',
          connection: 'keep-alive',
        },
      });

      await reply.send(response);
    });

    pluginDone();
  },
  { fastify: '4', name: 'version' },
);

enum EventNames {
  SERVER_VERSION = 'version',
  UPDATE_REQUEST = 'update-request',
}

interface SseEvent<E = string> {
  event: E;
  data: string;
  retry?: number;
}

const formatSseEvent = ({ event, data, retry }: SseEvent<EventNames>) => {
  let formatted = `event: ${event}\ndata: ${data}\n`;

  if (retry !== undefined) {
    formatted += `retry: ${retry}\n`;
  }

  return `${formatted}\n`;
};
