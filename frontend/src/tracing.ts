import { createReactRouterV7Options, ReactIntegration } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { init } from '@nais/apm';
import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType } from 'react-router';
import { ENVIRONMENT } from '@/environment';

const SERVICE_NAME = 'kabal-frontend-client';
const NAMESPACE = 'klage';

const getTelemetryCollectorURL = (): string | undefined => {
  if (ENVIRONMENT.isProduction) {
    return 'https://telemetry.nav.no/collect';
  }

  if (ENVIRONMENT.isDevelopment) {
    return 'https://telemetry.ekstern.dev.nav.no/collect';
  }

  if (window.location.hostname === 'localhost') {
    return '/collect';
  }

  return undefined;
};

const getClusterName = (): string => {
  if (ENVIRONMENT.isProduction) {
    return 'prod-gcp';
  }

  if (ENVIRONMENT.isDevelopment) {
    return 'dev-gcp';
  }

  return 'local';
};

const collectorUrl = getTelemetryCollectorURL();

if (collectorUrl !== undefined) {
  const faro = init({
    app: SERVICE_NAME,
    namespace: NAMESPACE,
    version: ENVIRONMENT.version,
    environment: getClusterName(),
    telemetryUrl: collectorUrl,
    faro: {
      paused: ENVIRONMENT.isLocal || ENVIRONMENT.isDevelopment,
      sessionTracking: {
        enabled: true,
        persistent: true,
      },
    },
  });

  faro.instrumentations.add(
    new TracingInstrumentation(),
    new ReactIntegration({
      router: createReactRouterV7Options({
        createRoutesFromChildren,
        matchRoutes,
        Routes,
        useLocation,
        useNavigationType,
      }),
    }),
  );
}
