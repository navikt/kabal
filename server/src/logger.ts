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

type LogArgs =
  | {
      msg?: string;
      traceId?: string;
      error: Error | unknown;
      data?: SerializableValue;
    }
  | {
      msg: string;
      traceId?: string;
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
  traceId?: string;
  version: string;
  module: string;
  message?: string;
  stacktrace?: string;
}

type Level = 'debug' | 'info' | 'warn' | 'error';

export const getLogger = (module: string): Logger => {
  const cachedLogger = LOGGERS.get(module);

  if (typeof cachedLogger !== 'undefined') {
    return cachedLogger;
  }

  const logger: Logger = {
    debug: (args) => console.debug(getLog(module, 'debug', args)),
    info: (args) => console.info(getLog(module, 'info', args)),
    warn: (args) => console.warn(getLog(module, 'warn', args)),
    error: (args) => console.warn(getLog(module, 'error', args)),
  };

  LOGGERS.set(module, logger);

  return logger;
};

const getLog = (module: string, level: Level, { msg, traceId, error, data }: LogArgs) => {
  const log: Log = {
    ...(typeof data === 'object' && data !== null && !Array.isArray(data) ? data : { data }),
    level,
    '@timestamp': new Date().toISOString(),
    version: VERSION,
    module,
    traceId,
  };

  if (error instanceof Error) {
    log.stacktrace = error.stack;
    log.message = typeof msg === 'string' ? `${msg} - ${error.name}: ${error.message}` : error.message;
  } else {
    log.message = msg;
  }

  return JSON.stringify(log);
};
