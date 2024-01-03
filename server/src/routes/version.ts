import { Router } from 'express';
import { Gauge, Histogram } from 'prom-client';
import { VERSION } from '@app/config/config';
import { registers } from '@app/prometheus/types';

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

export const setupVersionRoute = () => {
  router.get('/version', (req, res) => {
    if (req.headers.accept !== 'text/event-stream') {
      res.status(307).redirect('/');

      return;
    }

    const stopTimer = histogram.startTimer();

    gauge.inc();

    res.writeHead(200, HEADERS);
    res.write('retry: 0\n');
    res.write(`data: ${VERSION}\n\n`);

    res.once('close', () => {
      stopTimer();
      gauge.dec();
    });
  });

  return router;
};
