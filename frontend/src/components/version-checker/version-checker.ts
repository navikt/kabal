import {
  appThemeStore,
  getAppTheme,
  getSystemTheme,
  getUserTheme,
  systemThemeStore,
  userThemeStore,
} from '@app/app-theme';
import { USER_ACTIVITY } from '@app/components/version-checker/user-activity';
import { ENVIRONMENT } from '@app/environment';
import { getQueryParams } from '@app/headers';
import { pushError } from '@app/observability';
import { useSyncExternalStore } from 'react';

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
  private eventSource: EventSource;
  private appTheme = getAppTheme();
  private userTheme = getUserTheme();
  private systemTheme = getSystemTheme();
  private active = !document.hidden;

  constructor() {
    console.info('CURRENT VERSION', ENVIRONMENT.version);

    this.eventSource = this.createEventSource();

    // Expose a method to manually trigger an update request. Used for testing and debugging. Available in all environments.
    window.sendUpdateRequest = (data: UpdateRequest) => {
      this.onUpdateRequest(new MessageEvent(UPDATE_REQUEST_EVENT, { data }));
    };

    // Listen for app theme changes
    appThemeStore.subscribe((appTheme) => {
      if (this.appTheme !== appTheme) {
        this.appTheme = appTheme;
        this.reopenEventSource();
      }
    });

    // Listen for user theme changes
    userThemeStore.subscribe((userTheme) => {
      if (this.userTheme !== userTheme) {
        this.userTheme = userTheme;
        this.reopenEventSource();
      }
    });

    // Listen for system theme changes
    systemThemeStore.subscribe((systemTheme) => {
      if (this.systemTheme !== systemTheme) {
        this.systemTheme = systemTheme;
        this.reopenEventSource();
      }
    });

    USER_ACTIVITY.addListener((active) => {
      if (this.active !== active) {
        this.active = active;
        this.reopenEventSource();
      }
    });
  }

  public getUpdateRequest = (): UpdateRequest => this.updateRequest;

  private delay = 0;

  private reopenEventSource = () => {
    this.eventSource.close();
    this.delay = 0;
    this.eventSource = this.createEventSource();
  };

  private createEventSource = () => {
    const params = getQueryParams();
    params.set('theme', this.appTheme);
    params.set('user_theme', this.userTheme);
    params.set('system_theme', this.systemTheme);
    params.set('active', this.active ? 'true' : 'false');

    const events = new EventSource(`/version?${params.toString()}`);

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

    return events;
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

export const useIsUpToDate = (): boolean =>
  useSyncExternalStore(
    (onStoreChange) => {
      VERSION_CHECKER.addUpdateRequestListener(onStoreChange);

      return () => VERSION_CHECKER.removeUpdateRequestListener(onStoreChange);
    },
    () => VERSION_CHECKER.getIsUpToDate(),
  );
