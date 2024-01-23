import { ENVIRONMENT } from '@app/environment';
import { TRACEPARENT_HEADER, generateTraceParent } from '@app/functions/generate-request-id';

type OnVersionFn = (isDifferent: boolean) => void;

export class VersionChecker {
  private events: EventSource | undefined;
  private onVersion: OnVersionFn;

  constructor(onVersion: OnVersionFn) {
    this.onVersion = onVersion;

    console.info('CURRENT VERSION', ENVIRONMENT.version);

    this.getEventSource();
  }

  private delay = 0;

  private getEventSource() {
    const events = new EventSource(
      `/version?version=${ENVIRONMENT.version}&${TRACEPARENT_HEADER}=${generateTraceParent()}`,
    );

    events.addEventListener('error', () => {
      if (events.readyState === EventSource.CLOSED) {
        if (this.delay === 0) {
          this.getEventSource();
        } else {
          setTimeout(this.getEventSource.bind(this), this.delay);
        }

        this.delay = this.delay === 0 ? 500 : Math.min(this.delay + 500, 10000);
      }
    });

    events.addEventListener('open', () => {
      this.delay = 0;
    });

    events.addEventListener('message', ({ data }) => {
      console.info('VERSION', data);
      this.onVersion(data !== ENVIRONMENT.version);
    });

    this.events = events;
  }

  public close() {
    this.events?.close();
  }
}
