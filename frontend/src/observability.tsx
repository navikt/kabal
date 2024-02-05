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

export const pushEvent = (name: string, attributes: Record<string, string> | undefined, domain?: string) =>
  faro.api.pushEvent(name, attributes, domain, { skipDedupe: true });

const { pushMeasurement } = faro.api;

class EditorMeasurements {
  private measurements: number[] = [];
  private counter = 0;

  constructor() {
    setInterval(() => {
      if (this.measurements.length === 0) {
        return;
      }

      const max = Math.max(...this.measurements);
      const average = this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length;

      pushMeasurement({
        type: 'render_smart_editor',
        values: { render_smart_editor_max: max, render_smart_editor_avg: average },
      });

      this.measurements = [];
    }, 10000);
  }

  add = (render_smart_editor: number) => {
    // Drop 10 first measurements to avoid logging cold start
    if (++this.counter < 10) {
      return;
    }

    this.measurements.push(render_smart_editor);
  };
}

export const editorMeasurements = new EditorMeasurements();
