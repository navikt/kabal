import { ReactIntegration, ReactRouterVersion, getWebInstrumentations, initializeFaro } from '@grafana/faro-react';
import { LogLevel, PushLogOptions, faro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { Routes, createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';
import { ENVIRONMENT } from '@app/environment';

const getUrl = () => {
  if (ENVIRONMENT.isProduction) {
    return 'https://telemetry.nav.no/collect';
  }

  if (ENVIRONMENT.isDevelopment) {
    return 'https://telemetry.ekstern.dev.nav.no/collect';
  }

  return '/collect';
};

initializeFaro({
  url: getUrl(),
  app: { name: 'kabal-frontend', version: ENVIRONMENT.version },
  paused: ENVIRONMENT.isLocal,
  batching: {
    enabled: true,
    sendTimeout: ENVIRONMENT.isProduction ? 250 : 30000,
    itemLimit: ENVIRONMENT.isProduction ? 50 : 100,
  },
  instrumentations: [
    ...getWebInstrumentations({ captureConsole: false }),
    new TracingInstrumentation(),
    new ReactIntegration({
      router: {
        version: ReactRouterVersion.V6,
        dependencies: {
          createRoutesFromChildren,
          matchRoutes,
          Routes,
          useLocation,
          useNavigationType,
        },
      },
    }),
  ],
});

export const pushEvent = (name: string, domain: string, attributes?: Record<string, string>) =>
  faro.api.pushEvent(name, attributes, domain, { skipDedupe: true });

export const pushLog = (message: string, options?: Omit<PushLogOptions, 'skipDedupe'>, level = LogLevel.DEBUG) =>
  faro.api.pushLog([message], { ...options, skipDedupe: true, level });

export const { pushMeasurement, pushError } = faro.api;
