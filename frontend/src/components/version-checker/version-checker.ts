import { useSyncExternalStore } from 'react';
import {
  appThemeStore,
  getAppTheme,
  getSystemTheme,
  getUserTheme,
  systemThemeStore,
  userThemeStore,
} from '@/app-theme';
import { IDLE_TRACKER, type IdleState } from '@/components/version-checker/idle-tracker';
import { ENVIRONMENT } from '@/environment';
import { getQueryParams } from '@/headers';
import { pushError } from '@/observability';

export enum UpdateRequest {
  REQUIRED = 'REQUIRED',
  OPTIONAL = 'OPTIONAL',
  NONE = 'NONE',
}

const UPDATE_REQUEST_EVENT = 'update-request';

type UpdateRequestListenerFn = (request: UpdateRequest) => void;
type IsUpToDateListenerFn = () => void;

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
  private isUpToDateListeners: IsUpToDateListenerFn[] = [];
  private eventSource: EventSource;
  private appTheme = getAppTheme();
  private userTheme = getUserTheme();
  private systemTheme = getSystemTheme();
  private status: IdleState = 'active';

  constructor() {
    console.info('CURRENT VERSION', ENVIRONMENT.version);

    this.eventSource = this.createEventSource();

    window.addEventListener('beforeunload', () => {
      this.eventSource.close();
    });

    // Expose a method for manually sending update requests from the browser console for testing purposes.
    window.sendUpdateRequest = (data: UpdateRequest) => {
      this.onUpdateRequest(new MessageEvent(UPDATE_REQUEST_EVENT, { data }));
    };

    // Listen for idle state changes
    IDLE_TRACKER.subscribe(this.onIdleStateChange);

    // Listen for app theme changes
    appThemeStore.subscribe((appTheme) => {
      if (this.appTheme !== appTheme) {
        this.appTheme = appTheme;

        // Skip reconnect while idle — the updated theme will be picked up
        // when the user returns and we reopen as active.
        if (this.status === 'active') {
          this.reopenEventSource();
        }
      }
    });

    // Listen for user theme changes
    userThemeStore.subscribe((userTheme) => {
      if (this.userTheme !== userTheme) {
        this.userTheme = userTheme;

        if (this.status === 'active') {
          this.reopenEventSource();
        }
      }
    });

    // Listen for system theme changes
    systemThemeStore.subscribe((systemTheme) => {
      if (this.systemTheme !== systemTheme) {
        this.systemTheme = systemTheme;

        if (this.status === 'active') {
          this.reopenEventSource();
        }
      }
    });
  }

  private onIdleStateChange = (state: IdleState): void => {
    this.status = state;
    this.reopenEventSource();
  };

  public getUpdateRequest = (): UpdateRequest => this.updateRequest;

  private delay = 0;

  private reopenEventSource = () => {
    if (this.eventSource.readyState === EventSource.CLOSED) {
      return;
    }

    this.eventSource.close();
    this.delay = 0;
    this.eventSource = this.createEventSource();
  };

  private createEventSource = () => {
    const params = getQueryParams();
    params.set('theme', this.appTheme);
    params.set('user_theme', this.userTheme);
    params.set('system_theme', this.systemTheme);
    params.set('status', this.status);

    const events = new EventSource(`/version?${params.toString()}`);

    events.addEventListener('error', () => {
      if (events.readyState !== EventSource.CLOSED) {
        return;
      }

      // Only reconnect if this is still the active connection.
      // reopenEventSource() may have already replaced it.
      if (this.eventSource !== events) {
        return;
      }

      // Update delay before scheduling so the timeout uses the correct value.
      const reconnectDelay = this.delay;
      this.delay = this.delay === 0 ? 500 : Math.min(this.delay + 500, 10_000);

      const reconnect = () => {
        // Guard again: a concurrent reopenEventSource() call may have replaced the connection.
        if (this.eventSource !== events) {
          return;
        }

        this.eventSource = this.createEventSource();
      };

      if (reconnectDelay === 0) {
        reconnect();
      } else {
        setTimeout(reconnect, reconnectDelay);
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

    const wasUpToDate = this.isUpToDate;
    this.latestVersion = data;
    this.isUpToDate = data === ENVIRONMENT.version;

    if (this.isUpToDate !== wasUpToDate) {
      for (const listener of this.isUpToDateListeners) {
        listener();
      }
    }
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

  public addIsUpToDateListener(listener: () => void): void {
    if (!this.isUpToDateListeners.includes(listener)) {
      this.isUpToDateListeners.push(listener);
    }
  }

  public removeIsUpToDateListener(listener: () => void): void {
    this.isUpToDateListeners = this.isUpToDateListeners.filter((l) => l !== listener);
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
      VERSION_CHECKER.addIsUpToDateListener(onStoreChange);

      return () => VERSION_CHECKER.removeIsUpToDateListener(onStoreChange);
    },
    () => VERSION_CHECKER.getIsUpToDate(),
  );
