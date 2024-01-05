import { Router } from 'express';
import { Gauge, Histogram } from 'prom-client';
import { VERSION } from '@app/config/config';
import { getLogger } from '@app/logger';
import { registers } from '@app/prometheus/types';

const log = getLogger('active-clients');

const router = Router();

const HEADERS = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache',
};

const histogram = new Histogram({
  name: 'session_duration_seconds',
  help: 'Duration of user sessions in seconds',
  buckets: [5, 10, 30, 60, 90, 120, 150, 180, 210, 240, 300, 360, 420, 480, 540, 600, 660, 720].map((n) => n * 60),
  registers,
});

const gauge = new Gauge({ name: 'active_clients', help: 'Number of active clients', registers });

type StopTimerFn = () => void;
const stopTimerList: StopTimerFn[] = [];

export const resetActiveClientCounter = () => {
  gauge.reset();
  stopTimerList.forEach((stopTimer) => stopTimer());
};

export const setupVersionRoute = () => {
  router.get('/version', (req, res) => {
    if (req.headers.accept !== 'text/event-stream') {
      res.status(307).redirect('/');

      return;
    }

    const stopTimer = histogram.startTimer();

    const stopTimerIndex = stopTimerList.push(stopTimer);

    let isOpen = true;

    gauge.inc();

    const onEnd = () => {
      if (isOpen) {
        isOpen = false;
        stopTimer();
        gauge.dec();
        stopTimerList.splice(stopTimerIndex, 1);
      }
    };

    res.once('close', () => {
      log.debug({ msg: 'Version connection closed' });
      onEnd();
    });

    res.once('error', () => {
      log.debug({ msg: 'Version connection error' });
      onEnd();
    });

    res.writeHead(200, HEADERS);
    res.write('retry: 0\n');
    res.write(`data: ${VERSION}\n\n`);
  });

  return router;
};
