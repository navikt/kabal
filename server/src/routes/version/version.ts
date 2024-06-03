import { Response, Router } from 'express';
import { VERSION } from '@app/config/config';
import { getLogger } from '@app/logger';
import { ensureTraceparent } from '@app/request-id';
import { histogram } from '@app/routes/version/session-histogram';
import { startUserSession, uniqueUsersGauge } from '@app/routes/version/unique-users-gauge';
import { getUpdateRequest } from '@app/routes/version/update-request';

const log = getLogger('active-clients');

const router = Router();

const HEADERS = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache',
};

type StopTimerFn = () => void;
const stopTimerList: StopTimerFn[] = [];

export const resetClientsAndUniqueUsersMetrics = async () => {
  stopTimerList.forEach((stopTimer) => stopTimer());
  uniqueUsersGauge.reset();

  // Wait for metrics to be collected.
  return new Promise<void>((resolve) => setTimeout(resolve, 2000));
};

export const setupVersionRoute = () => {
  router.get('/version', async (req, res) => {
    if (req.headers.accept !== 'text/event-stream') {
      res.status(307).redirect('/');

      return;
    }

    const traceId = ensureTraceparent(req);

    const stopTimer = histogram.startTimer();

    const stopTimerIndex = stopTimerList.push(stopTimer) - 1;

    let isOpen = true;

    const endUserSession = await startUserSession(req, traceId);

    res.once('close', () => {
      log.debug({ msg: 'Version connection closed', traceId });

      if (isOpen) {
        isOpen = false;
        stopTimerList.splice(stopTimerIndex, 1);
        stopTimer();
        endUserSession();
      }
    });

    res.writeHead(200, HEADERS);
    res.write('retry: 0\n');
    res.write(`data: ${VERSION}\n\n`); // TODO: Remove this line after all clients are updated to handle the version event.
    writeEvent(res, EventNames.SERVER_VERSION, VERSION);
    writeEvent(res, EventNames.UPDATE_REQUEST, getUpdateRequest(req, traceId));
  });

  return router;
};

enum EventNames {
  SERVER_VERSION = 'version',
  UPDATE_REQUEST = 'update-request',
}

const writeEvent = (res: Response, event: EventNames, data: string) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${data}\n\n`);
};
