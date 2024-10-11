import { PROXY_VERSION, START_TIME } from '@app/config/config';
import { getLogger } from '@app/logger';
import { proxyRegister } from '@app/prometheus/types';
import type { FastifyRequest } from 'fastify';
import { Gauge, type LabelValues } from 'prom-client';

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

/** Parses the user ID from the JWT. */
export const startUserSession = (req: FastifyRequest): (() => void) => {
  const { navIdent, trace_id, span_id } = req;

  if (navIdent.length === 0) {
    log.warn({ msg: 'No NAV-ident related to the session', trace_id, span_id });

    return NOOP;
  }

  return start(navIdent, req);
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
    domain: req.headers.host ?? 'UNKNOWN',
  };

  uniqueUsersGauge.set(labels, 1);

  return () => uniqueUsersGauge.remove(labels);
};
