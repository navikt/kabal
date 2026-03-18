import type { TraceEvent, TransportItem } from '@grafana/faro-core';
import { createReactRouterV7Options, ReactIntegration } from '@grafana/faro-react';
import { getWebInstrumentations, initializeFaro, TransportItemType } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { ENVIRONMENT } from '@/environment';

const SERVICE_NAME = 'kabal-frontend-client';

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

const isTraceItem = (item: TransportItem): item is TransportItem<TraceEvent> => item.type === TransportItemType.TRACE;

const collectorUrl = getTelemetryCollectorURL();

if (collectorUrl !== undefined) {
  initializeFaro({
    url: collectorUrl,
    app: {
      name: SERVICE_NAME,
      version: ENVIRONMENT.version,
    },
    sessionTracking: {
      enabled: true,
      persistent: true,
    },
    beforeSend: ENVIRONMENT.isProduction
      ? undefined
      : (item) => {
          if (isTraceItem(item)) {
            const { resourceSpans } = item.payload;

            for (const resourceSpan of resourceSpans ?? []) {
              for (const scopeSpan of resourceSpan.scopeSpans) {
                for (const span of scopeSpan.spans ?? []) {
                  console.debug('[Faro trace]', {
                    traceId: span.traceId,
                    spanId: span.spanId,
                    parentSpanId: span.parentSpanId,
                    name: span.name,
                  });
                }
              }
            }
          }

          return item;
        },
    instrumentations: [
      ...getWebInstrumentations(),
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
    ],
  });
}
