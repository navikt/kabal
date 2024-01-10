import { Router } from 'express';
import { Gauge, Histogram } from 'prom-client';
import { VERSION } from '@app/config/config';
import { getLogger } from '@app/logger';
import { registers } from '@app/prometheus/types';
import { ensureTraceparent } from '@app/request-id';

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

const uniqueUsersGauge = new Gauge({
  name: 'active_users',
  help: 'Number of active unique users',
  labelNames: ['nav_ident'] as const,
  registers,
});

type StopTimerFn = () => void;
const stopTimerList: StopTimerFn[] = [];

export const resetClientsAndUniqueUsersMetrics = async () => {
  stopTimerList.forEach((stopTimer) => stopTimer());
  await resetUniqueUsersCounts();

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

    const endUserSession = await startUserSession(req.headers.authorization, traceId);

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
    res.write(`data: ${VERSION}\n\n`);
  });

  return router;
};

interface TokenPayload {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  aio: string;
  azp: string;
  azpacr: string;
  groups: string[];
  name: string;
  oid: string;
  preferred_username: string;
  rh: string;
  scp: string;
  sub: string;
  tid: string;
  uti: string;
  ver: string;
  NAVident: string;
  azp_name: string;
}

/** Parses the user ID from the JWT. */
const startUserSession = async (token: string | undefined, traceId: string): Promise<() => void> => {
  if (token === undefined) {
    return NOOP;
  }

  const [, payload] = token.split('.');

  if (payload === undefined) {
    return NOOP;
  }

  const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');

  try {
    const { NAVident: nav_ident } = JSON.parse(decodedPayload) as TokenPayload;

    await setCount(nav_ident, increment);

    return () => setCount(nav_ident, decrement);
  } catch (error) {
    log.warn({ msg: 'Failed to parse NAV-ident from token', error, traceId });

    return NOOP;
  }
};

const NOOP = () => undefined;

const setCount = async (nav_ident: string, getNewValue: (oldValue: number) => number) => {
  const { values } = await uniqueUsersGauge.get();

  for (const { labels, value } of values) {
    if (labels.nav_ident === nav_ident) {
      uniqueUsersGauge.set(labels, getNewValue(value));

      return;
    }
  }

  uniqueUsersGauge.set({ nav_ident }, getNewValue(0));
};

const increment = (oldValue: number) => oldValue + 1;
const decrement = (oldValue: number) => (oldValue === 0 ? 0 : oldValue - 1);

const resetUniqueUsersCounts = async () => {
  const { values } = await uniqueUsersGauge.get();

  for (const { labels } of values) {
    uniqueUsersGauge.set(labels, 0);
  }
};
