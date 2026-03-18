import { LogLevel as FaroLogLevel, faro } from '@grafana/faro-web-sdk';
import { useCallback } from 'react';
import { useGrafanaDomain } from '@/components/grafana-domain-context/grafana-domain-context';

// --- Log levels (replacing Grafana Faro LogLevel) ---

export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

const toFaroLogLevel = (level: LogLevel): FaroLogLevel => {
  switch (level) {
    case LogLevel.TRACE:
      return FaroLogLevel.TRACE;
    case LogLevel.DEBUG:
      return FaroLogLevel.DEBUG;
    case LogLevel.INFO:
      return FaroLogLevel.INFO;
    case LogLevel.WARN:
      return FaroLogLevel.WARN;
    case LogLevel.ERROR:
      return FaroLogLevel.ERROR;
  }
};

// --- Public API (same surface as the old module) ---

export interface PushLogOptions {
  context?: Record<string, string>;
  skipDedupe?: boolean;
}

/**
 * Push a custom named event.
 */
export const pushEvent = (name: string, domain: string, attributes?: Record<string, string>): void => {
  faro.api?.pushEvent(name, { domain, ...attributes });
};

/**
 * Push a log message.
 */
export const pushLog = (
  message: string,
  options?: Omit<PushLogOptions, 'skipDedupe'>,
  level: LogLevel = LogLevel.DEBUG,
): void => {
  faro.api?.pushLog([message], { level: toFaroLogLevel(level), context: options?.context });
};

/**
 * Push a measurement with the given type and values.
 */
export const pushMeasurement = (measurement: { type: string; values: Record<string, number> }): void => {
  faro.api?.pushMeasurement({ type: measurement.type, values: measurement.values });
};

/**
 * Push an error for observability.
 */
export const pushError = (error: Error, options?: { context?: Record<string, string> }): void => {
  faro.api?.pushError(error, { context: options?.context });
};

/**
 * React hook that returns a `pushEvent` function pre-bound to the current Grafana domain.
 */
export const usePushEvent = () => {
  const domain = useGrafanaDomain();

  return useCallback(
    (name: string, attributes?: Record<string, string>) => pushEvent(name, domain, attributes),
    [domain],
  );
};
