import { Gauge, LabelValues } from 'prom-client';
import { PROXY_VERSION, START_TIME } from '@app/config/config';
import { getLogger } from '@app/logger';
import { proxyRegister } from '@app/prometheus/types';
import { FastifyRequest } from 'fastify';

const log = getLogger('active-clients');

const labelNames = [
  'nav_ident',
  'client_version',
  'up_to_date_client',
  'start_time',
  'app_start_time',
  'trace_id',
  'span_id',
  'domain',
] as const;

type LabelNames = (typeof labelNames)[number];

export const uniqueUsersGauge = new Gauge({
  name: 'active_users',
  help: 'Number of active unique users. All timestamps are Unix timestamps in milliseconds (UTC). "start_time" is when the session started. "app_start_time" is when the app started.',
  labelNames,
  registers: [proxyRegister],
});

type StopTimerFn = () => void;
export const stopTimerList: StopTimerFn[] = [];

export const resetClientsAndUniqueUsersMetrics = async () => {
  stopTimerList.forEach((stopTimer) => stopTimer());
  uniqueUsersGauge.reset();

  // Wait for metrics to be collected.
  return new Promise<void>((resolve) => setTimeout(resolve, 2000));
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
export const startUserSession = (req: FastifyRequest): (() => void) => {
  const { accessToken, trace_id, span_id } = req;

  if (accessToken.length === 0) {
    return NOOP;
  }

  const [, payload] = accessToken.split('.');

  if (payload === undefined) {
    log.warn({ msg: 'Token has no payload', trace_id, span_id });

    return NOOP;
  }

  const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');

  try {
    const { NAVident: nav_ident } = JSON.parse(decodedPayload) as TokenPayload;

    return start(nav_ident, req);
  } catch (error) {
    log.warn({ msg: 'Failed to parse NAV-ident from token', error, trace_id, span_id });

    return NOOP;
  }
};

const NOOP = () => undefined;

type EndFn = () => void;

const start = (nav_ident: string, req: FastifyRequest): EndFn => {
  const labels: LabelValues<LabelNames> = {
    nav_ident,
    client_version: req.client_version ?? 'UNKNOWN',
    up_to_date_client: req.client_version === PROXY_VERSION ? 'true' : 'false',
    start_time: Date.now().toString(10),
    app_start_time: START_TIME,
    trace_id: req.trace_id,
    span_id: req.span_id,
    domain: req.headers['host'] ?? 'UNKNOWN',
  };

  uniqueUsersGauge.set(labels, 1);

  return () => uniqueUsersGauge.remove(labels);
};
