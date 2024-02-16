import { ReactIntegration, ReactRouterVersion, getWebInstrumentations, initializeFaro } from '@grafana/faro-react';
import { LogLevel, PushLogOptions, faro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { Routes, createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';
import { ENVIRONMENT } from '@app/environment';
import { IUserData } from '@app/types/bruker';
import { user } from '@app/user';

const MEASURE_TIME_INTERVAL = 10_000;

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

export const pushEvent = (name: string, attributes: Record<string, string> | undefined, domain?: string) =>
  faro.api.pushEvent(name, attributes, domain, { skipDedupe: true });

export const pushLog = (message: string, options?: Omit<PushLogOptions, 'skipDedupe'>, level = LogLevel.DEBUG) =>
  faro.api.pushLog([message], { ...options, skipDedupe: true, level });

export const { pushMeasurement } = faro.api;

class EditorMeasurements {
  private measurements: number[] = [];
  private counter = 0;
  private user: IUserData | null = null;

  constructor() {
    user.then((userData) => {
      this.user = userData;
    });

    setInterval(() => {
      if (this.measurements.length === 0) {
        return;
      }

      const max = Math.max(...this.measurements);
      const average = this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length;

      faro.api.setUser({ id: this.user?.navIdent ?? 'Unknown user' });

      pushMeasurement({
        type: 'render_smart_editor',
        values: { render_smart_editor_max: max, render_smart_editor_avg: average },
      });

      faro.api.resetUser();

      this.measurements = [];
    }, MEASURE_TIME_INTERVAL);
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
