import { PROXY_VERSION, START_TIME } from '@app/config/config';
import { getLogger } from '@app/logger';
import type { VersionQueryString } from '@app/plugins/version/query';
import { proxyRegister } from '@app/prometheus/types';
import type { FastifyRequest } from 'fastify';
import { Gauge, type LabelValues } from 'prom-client';

const log = getLogger('clients');

const labelNames = [
  'nav_ident',
  'client_version',
  'up_to_date_client',
  'start_time',
  'app_start_time',
  'trace_id',
  'span_id',
  'domain',
  'theme',
  'user_theme',
  'system_theme',
  'active',
] as const;

type LabelNames = (typeof labelNames)[number];

const clientsGauge = new Gauge({
  name: 'clients',
  help: 'Number of clients. All timestamps are Unix timestamps in milliseconds (UTC). "start_time" is when the session started. "app_start_time" is when the app started.',
  labelNames,
  registers: [proxyRegister],
});

const NOOP = () => undefined;

type EndFn = () => void;

export const startClientSession = (req: FastifyRequest<{ Querystring: VersionQueryString }>): EndFn => {
  const { navIdent, client_version, trace_id, span_id, headers, query } = req;

  if (navIdent.length === 0) {
    log.warn({ msg: 'No NAV-ident related to the session', trace_id, span_id });

    return NOOP;
  }

  const labels: LabelValues<LabelNames> = {
    nav_ident: navIdent,
    client_version: client_version ?? 'UNKNOWN',
    up_to_date_client: client_version === PROXY_VERSION ? 'true' : 'false',
    start_time: Date.now().toString(10),
    app_start_time: START_TIME,
    trace_id: trace_id,
    span_id: span_id,
    domain: headers.host ?? 'UNKNOWN',
    theme: query.theme ?? 'light',
    user_theme: query.user_theme ?? 'system',
    system_theme: query.system_theme ?? 'light',
    active: query.active === 'true' ? 'true' : 'false',
  };

  clientsGauge.set(labels, 1);

  return () => clientsGauge.remove(labels);
};
