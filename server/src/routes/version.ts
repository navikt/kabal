import { Request, Router } from 'express';
import { Gauge, Histogram, LabelValues } from 'prom-client';
import { START_TIME, VERSION } from '@app/config/config';
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

const labelNames = [
  'nav_ident',
  'client_version',
  'up_to_date_client',
  'start_time',
  'app_start_time',
  'trace_id',
  'domain',
] as const;

type LabelNames = (typeof labelNames)[number];

const uniqueUsersGauge = new Gauge({
  name: 'active_users',
  help: 'Number of active unique users. All timestamps are Unix timestamps in milliseconds (UTC). "start_time" is when the session started. "app_start_time" is when the app started.',
  labelNames,
  registers,
});

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
const startUserSession = async (req: Request, traceId: string): Promise<() => void> => {
  if (req.headers.authorization === undefined) {
    return NOOP;
  }

  const [, payload] = req.headers.authorization.split('.');

  if (payload === undefined) {
    return NOOP;
  }

  const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');

  try {
    const { NAVident: nav_ident } = JSON.parse(decodedPayload) as TokenPayload;

    return start(nav_ident, getClientVersion(req), traceId, req.hostname);
  } catch (error) {
    log.warn({ msg: 'Failed to parse NAV-ident from token', error, traceId });

    return NOOP;
  }
};

const NOOP = () => undefined;

type EndFn = () => void;

const start = (nav_ident: string, clientVersion: string | undefined, trace_id: string, domain: string): EndFn => {
  const labels: LabelValues<LabelNames> = {
    nav_ident,
    client_version: clientVersion?.substring(0, 7) ?? 'UNKNOWN',
    up_to_date_client: clientVersion === VERSION ? 'true' : 'false',
    start_time: Date.now().toString(10),
    app_start_time: START_TIME,
    trace_id,
    domain,
  };

  uniqueUsersGauge.set(labels, 1);

  return () => uniqueUsersGauge.remove(labels);
};

const getClientVersion = (req: Request): string | undefined =>
  typeof req.query['version'] === 'string' ? req.query['version'] : undefined;
