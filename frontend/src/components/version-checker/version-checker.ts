import { ENVIRONMENT } from '@app/environment';
import { getQueryParams } from '@app/headers';
import { pushError } from '@app/observability';

type ListenerFn = (isUpToDate: boolean) => void;

class VersionChecker {
  private latestVersion = ENVIRONMENT.version;
  private isUpToDate = true;
  private listeners: ListenerFn[] = [];

  constructor() {
    console.info('CURRENT VERSION', ENVIRONMENT.version);

    if (!ENVIRONMENT.isLocal) {
      this.createEventSource();
    }
  }

  public addListener(listener: ListenerFn): VersionChecker {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }

    return this;
  }

  private delay = 0;

  private createEventSource = () => {
    const events = new EventSource(`/version?${getQueryParams()}`);

    events.addEventListener('error', () => {
      if (events.readyState === EventSource.CLOSED) {
        if (this.delay === 0) {
          this.createEventSource();
        } else {
          setTimeout(this.createEventSource, this.delay);
        }

        this.delay = this.delay === 0 ? 500 : Math.min(this.delay + 500, 10_000);
      }
    });

    events.addEventListener('open', () => {
      this.delay = 0;
    });

    events.addEventListener('message', ({ data }) => {
      console.info('VERSION', data);

      if (typeof data !== 'string') {
        console.error('Invalid version data', data);
        pushError(new Error('Invalid version data'));

        return;
      }

      this.latestVersion = data;
      this.isUpToDate = data === ENVIRONMENT.version;

      for (const listener of this.listeners) {
        listener(this.isUpToDate);
      }
    });
  };

  public getIsUpToDate = (): boolean => this.isUpToDate;
  public getLatestVersion = (): string => this.latestVersion;
}

export const VERSION_CHECKER = new VersionChecker();
