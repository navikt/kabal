import {
  getWebInstrumentations,
  initializeFaro,
  type TraceEvent,
  type TransportItem,
  TransportItemType,
} from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

declare const __APP_VERSION__: string;

const SERVICE_NAME = 'kabal-frontend-file-viewer';

const { hostname } = window.location;
const isDevelopment = hostname.endsWith('.dev.nav.no');
const isProduction = !isDevelopment && hostname.endsWith('.nav.no');

const getTelemetryCollectorURL = (): string | undefined => {
  if (isDevelopment) {
    return 'https://telemetry.ekstern.dev.nav.no/collect';
  }

  if (isProduction) {
    return 'https://telemetry.nav.no/collect';
  }

  if (hostname === 'localhost') {
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
      version: __APP_VERSION__,
    },
    sessionTracking: {
      enabled: true,
      persistent: true,
    },
    beforeSend: isProduction
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
    instrumentations: [...getWebInstrumentations(), new TracingInstrumentation()],
  });
}
