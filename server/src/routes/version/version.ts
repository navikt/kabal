import { PROXY_VERSION } from '@app/config/config';
import { formatDuration, getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { histogram } from '@app/routes/version/session-histogram';
import { startUserSession, stopTimerList } from '@app/routes/version/unique-users-gauge';
import { getUpdateRequest } from '@app/routes/version/update-request';
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

const log = getLogger('version');

export const setupVersionRoute = (server: Hono) => {
  server.get('/version', async (context) => {
    const { req, redirect, text } = context;

    if (req.header('accept') !== 'text/event-stream') {
      return redirect('/', 307);
    }

    const start = performance.now();

    const { traceId } = context.var;

    log.debug({ msg: 'Version connection opened', traceId, data: { sse: true } });

    const stopTimer = histogram.startTimer();
    const stopTimerIndex = stopTimerList.push(stopTimer) - 1;
    const endUserSession = startUserSession(context);

    const onClose = () => {
      stopTimerList.splice(stopTimerIndex, 1);
      stopTimer();
      endUserSession();
    };

    let isClosed = false;

    const onClosePromise = new Promise<string>((resolve) => {
      req.raw.signal.addEventListener('abort', () => resolve('req.raw.signal.addEventListener(abort)'));
      req.raw.signal.addEventListener('close', () => resolve('req.raw.signal.addEventListener(close)'));
      req.raw.signal.addEventListener('error', () => resolve('req.raw.signal.addEventListener(error)'));
      req.raw.signal.onabort = () => resolve('req.raw.signal.onabort');
    }).then((reason) => {
      isClosed = true;
      onClose();

      return reason;
    });

    try {
      return streamSSE(
        context,
        async (stream) => {
          await stream.writeSSE({ event: EventNames.SERVER_VERSION, data: PROXY_VERSION, retry: 0 });
          await stream.writeSSE({ event: EventNames.UPDATE_REQUEST, data: getUpdateRequest(context), retry: 0 });

          while (!isClosed) {
            await stream.sleep(1_000);
            await stream.writeSSE({ event: 'heartbeat', data: '', retry: 0 });
          }

          const reason = await onClosePromise;

          const duration = getDuration(start);

          log.debug({
            msg: `Version connection closed after ${formatDuration(duration)} (${reason})`,
            traceId,
            data: { sse: true, duration, reason },
          });
        },
        async (error) =>
          log.warn({
            msg: 'Version connection error',
            error,
            traceId,
            data: { sse: true, duration: getDuration(start) },
          }),
      );
    } catch (error) {
      onClose();

      const event = error instanceof DOMException && error.name === 'AbortError' ? 'aborted' : 'failed';

      log.debug({ msg: `Version SSE request ${event}`, traceId, data: { sse: true, duration: getDuration(start) } });

      if (event === 'failed') {
        return text('Version SSE request failed', 500);
      }
    }
  });
};

enum EventNames {
  SERVER_VERSION = 'version',
  UPDATE_REQUEST = 'update-request',
}
