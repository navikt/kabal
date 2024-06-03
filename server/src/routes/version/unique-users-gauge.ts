import { Request } from 'express';
import { Gauge, LabelValues } from 'prom-client';
import { START_TIME, VERSION } from '@app/config/config';
import { getLogger } from '@app/logger';
import { registers } from '@app/prometheus/types';
import { getClientVersion } from '@app/routes/version/get-client-version';

const log = getLogger('active-clients');

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

export const uniqueUsersGauge = new Gauge({
  name: 'active_users',
  help: 'Number of active unique users. All timestamps are Unix timestamps in milliseconds (UTC). "start_time" is when the session started. "app_start_time" is when the app started.',
  labelNames,
  registers,
});

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
export const startUserSession = async (req: Request, traceId: string): Promise<() => void> => {
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
