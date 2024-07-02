import { ENVIRONMENT } from '@app/environment';
import { getQueryParams } from '@app/headers';
import { pushError } from '@app/observability';

export enum UpdateRequest {
  REQUIRED = 'REQUIRED',
  OPTIONAL = 'OPTIONAL',
  NONE = 'NONE',
}

const UPDATE_REQUEST_EVENT = 'update-request';

type UpdateRequestListenerFn = (request: UpdateRequest) => void;

declare global {
  interface Window {
    sendUpdateRequest?: (data: UpdateRequest) => void;
  }
}

class VersionChecker {
  private latestVersion = ENVIRONMENT.version;
  private isUpToDate = true;
  private updateRequest: UpdateRequest = UpdateRequest.NONE;
  private updateRequestListeners: UpdateRequestListenerFn[] = [];

  constructor() {
    console.info('CURRENT VERSION', ENVIRONMENT.version);

    this.createEventSource();

    if (ENVIRONMENT.isLocal) {
      window.sendUpdateRequest = (data: UpdateRequest) => {
        this.onUpdateRequest(new MessageEvent(UPDATE_REQUEST_EVENT, { data }));
      };
    }
  }

  public getUpdateRequest = (): UpdateRequest => this.updateRequest;

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

    events.addEventListener('version', this.onVersion);

    events.addEventListener(UPDATE_REQUEST_EVENT, this.onUpdateRequest);
  };

  private onVersion = ({ data }: MessageEvent<string>) => {
    console.info('VERSION', data);

    if (typeof data !== 'string') {
      console.error('Invalid version data', data);
      pushError(new Error('Invalid version data'));

      return;
    }

    this.latestVersion = data;
    this.isUpToDate = data === ENVIRONMENT.version;
  };

  public addUpdateRequestListener(listener: UpdateRequestListenerFn): void {
    if (!this.updateRequestListeners.includes(listener)) {
      this.updateRequestListeners.push(listener);
    }

    if (this.updateRequest !== UpdateRequest.NONE) {
      listener(this.updateRequest);
    }
  }

  public removeUpdateRequestListener(listener: UpdateRequestListenerFn): void {
    this.updateRequestListeners = this.updateRequestListeners.filter((l) => l !== listener);
  }

  private onUpdateRequest = ({ data }: MessageEvent<string>) => {
    if (!isUpdateRequest(data)) {
      pushError(new Error(`Invalid update request: "${data}"`));

      return;
    }

    console.info('UPDATE REQUEST', data);

    this.updateRequest = data;

    for (const listener of this.updateRequestListeners) {
      listener(data);
    }
  };

  public getIsUpToDate = (): boolean => this.isUpToDate;
  public getLatestVersion = (): string => this.latestVersion;
}

const UPDATE_REQUEST_VALUES = Object.values(UpdateRequest);

const isUpdateRequest = (data: string): data is UpdateRequest => UPDATE_REQUEST_VALUES.some((value) => value === data);

export const VERSION_CHECKER = new VersionChecker();
