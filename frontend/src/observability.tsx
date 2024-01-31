import { ReactIntegration, ReactRouterVersion, getWebInstrumentations, initializeFaro } from '@grafana/faro-react';
import { faro } from '@grafana/faro-web-sdk';
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
  instrumentations: [
    ...getWebInstrumentations(),
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

export const { pushMeasurement, pushEvent } = faro.api;
