import { performance } from 'perf_hooks';
import { RequestHandler } from 'express';

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

interface AnyObject {
  [key: string]: SerializableValue;
}

type LogArgs =
  | {
      msg?: string;
      navCallId?: string;
      error: Error | unknown;
      data?: SerializableValue;
    }
  | {
      msg: string;
      navCallId?: string;
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
  nav_callid?: string;
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

const getLog = (module: string, level: Level, { msg, navCallId, error, data }: LogArgs) => {
  const log: Log = {
    ...(typeof data === 'object' && data !== null && !Array.isArray(data) ? data : { data }),
    level,
    '@timestamp': new Date().toISOString(),
    version: VERSION,
    module,
    nav_callid: navCallId,
  };

  if (error instanceof Error) {
    log.stacktrace = error.stack;
    log.message = typeof msg === 'string' ? `${msg} - ${error.name}: ${error.message}` : error.message;
  } else {
    log.message = msg;
  }

  return JSON.stringify(log);
};

const httpLogger = getLogger('http');

export const httpLoggingMiddleware: RequestHandler = (req, res, next) => {
  const start = performance.now();

  res.once('finish', () => {
    const { method, url, headers } = req;

    if (url.endsWith('/isAlive') || url.endsWith('/isReady')) {
      return;
    }

    const { statusCode } = res;

    const responseTime = Math.round(performance.now() - start);
    const navCallIdValue = headers['nav-callid'];
    const navCallId = Array.isArray(navCallIdValue) ? navCallIdValue[0] : navCallIdValue;

    logHttpRequest({
      method,
      url,
      statusCode,
      navCallId,
      responseTime,
    });
  });

  next();
};

interface HttpData extends AnyObject {
  method: string;
  url: string;
  statusCode: number;
  navCallId?: string;
  responseTime: number;
}

const logHttpRequest = ({ navCallId, ...data }: HttpData) => {
  const msg = `${data.statusCode} ${data.method} ${data.url}`;

  if (data.statusCode >= 500) {
    httpLogger.error({ msg, navCallId, data });

    return;
  }

  if (data.statusCode >= 400) {
    httpLogger.warn({ msg, navCallId, data });

    return;
  }

  httpLogger.debug({ msg, navCallId, data });
};
