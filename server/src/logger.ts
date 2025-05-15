import { TEAM_LOG_PARMS } from '@app/config/config';
import { hasOwn } from '@app/functions/functions';
import { isDeployed } from './config/env';

const VERSION: string =
  // biome-ignore lint/nursery/noProcessEnv:
  hasOwn(process.env, 'VERSION') && typeof process.env.VERSION === 'string' ? process.env.VERSION : 'unknown';

const LOGGERS: Map<string, Logger> = new Map();
const TEAM_LOGGERS: Map<string, Logger> = new Map();

type SerializableValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | null
  | null[]
  | undefined
  | undefined[]
  | AnyObject
  | AnyObject[];

export interface AnyObject {
  [key: string]: SerializableValue;
}

export type LogArgs =
  | {
      msg?: string;
      trace_id?: string;
      span_id?: string;
      client_version?: string;
      tab_id?: string;
      error: Error | unknown;
      data?: SerializableValue;
    }
  | {
      msg: string;
      trace_id?: string;
      span_id?: string;
      client_version?: string;
      tab_id?: string;
      error?: Error | unknown;
      data?: SerializableValue;
    };

interface Logger {
  debug: (args: LogArgs) => void;
  info: (args: LogArgs) => void;
  warn: (args: LogArgs) => void;
  error: (args: LogArgs) => void;
}

interface Log extends AnyObject {
  '@timestamp': string;
  trace_id?: string;
  span_id?: string;
  proxy_version: string;
  client_version?: string;
  module: string;
  message?: string;
  stacktrace?: string;
}

export type Level = 'debug' | 'info' | 'warn' | 'error';

export const getLogger = (module: string): Logger => {
  const cachedLogger = LOGGERS.get(module);

  if (typeof cachedLogger !== 'undefined') {
    return cachedLogger;
  }

  const logger: Logger = {
    debug: (args) => logDefined(getLog(module, 'debug', args), 'debug'),
    info: (args) => logDefined(getLog(module, 'info', args), 'info'),
    warn: (args) => logDefined(getLog(module, 'warn', args), 'warn'),
    error: (args) => logDefined(getLog(module, 'error', args), 'error'),
  };

  LOGGERS.set(module, logger);

  return logger;
};

const logDefined = (message: string | undefined, level: Level): void => {
  if (message === undefined) {
    return;
  }

  console[level](message);
};

const getLog = (
  module: string,
  level: Level,
  { msg: message, trace_id, span_id, client_version, tab_id, error, data }: LogArgs,
  isTeamLog = false,
): string | undefined => {
  const log: Log = {
    ...(typeof data === 'object' && data !== null && !Array.isArray(data) ? data : { data }),
    level,
    '@timestamp': new Date().toISOString(),
    proxy_version: VERSION,
    client_version,
    module,
    tab_id,
    trace_id,
    span_id,
  };

  if (error instanceof Error) {
    log.stacktrace = error.stack;
    log.message = typeof message === 'string' ? `${message} - ${error.name}: ${error.message}` : error.message;
  } else {
    log.message = message;
  }

  if (isDeployed) {
    return JSON.stringify(isTeamLog ? { ...TEAM_LOG_PARMS, ...log, severity: level.toUpperCase() } : log);
  }

  if (
    module === 'http' ||
    module === 'version' ||
    module === 'api-proxy' ||
    module === 'obo-token-plugin' ||
    module === 'prepare-proxy-request-headers'
  ) {
    return;
  }

  return message;
};

export const getTeamLogger = (module: string) => {
  const cachedLogger = TEAM_LOGGERS.get(module);

  if (typeof cachedLogger !== 'undefined') {
    return cachedLogger;
  }

  const sendLog = (level: Level, args: LogArgs) => {
    return isDeployed
      ? fetch('http://team-logs.nais-system', {
          method: 'POST',
          body: getLog(module, level, args, true),
          headers: { 'Content-Type': 'application/json' },
        })
      : logDefined(getLog(module, level, args), level);
  };

  const logger: Logger = {
    debug: (args) => sendLog('debug', args),
    info: (args) => sendLog('info', args),
    warn: (args) => sendLog('warn', args),
    error: (args) => sendLog('error', args),
  };

  TEAM_LOGGERS.set(module, logger);

  return logger;
};
