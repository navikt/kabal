import { isDeployed } from './config/env';

const VERSION = process.env.VERSION ?? 'unknown';

const LOGGERS: Map<string, Logger> = new Map();

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

  // eslint-disable-next-line no-console
  console[level](message);
};

const getLog = (
  module: string,
  level: Level,
  { msg, trace_id, span_id, client_version, tab_id, error, data }: LogArgs,
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
    log.message = typeof msg === 'string' ? `${msg} - ${error.name}: ${error.message}` : error.message;
  } else {
    log.message = msg;
  }

  if (isDeployed) {
    return JSON.stringify(log);
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

  return msg;
};
