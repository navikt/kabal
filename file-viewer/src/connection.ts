import { IDLE_TRACKER, type IdleState } from '@/idle-tracker';

const TAB_ID = crypto.randomUUID();

const RETRY_DELAY_MS = 500;
const MAX_RETRY_DELAY_MS = 10_000;

/**
 * Version connection is only used for metrics in the file viewer.
 */
class VersionConnection {
  private eventSource: EventSource;
  private status: IdleState = 'active';
  private delay = 0;

  constructor() {
    this.eventSource = this.createEventSource();

    window.addEventListener('beforeunload', () => {
      this.eventSource.close();
    });

    IDLE_TRACKER.subscribe(this.onIdleStateChange);
  }

  private onIdleStateChange = (state: IdleState): void => {
    this.status = state;
    this.reopenEventSource();
  };

  private reopenEventSource = (): void => {
    if (this.eventSource.readyState === EventSource.CLOSED) {
      return;
    }

    this.eventSource.close();
    this.delay = 0;
    this.eventSource = this.createEventSource();
  };

  private createEventSource = (): EventSource => {
    const params = new URLSearchParams({ tabId: TAB_ID, status: this.status, app: 'file-viewer' });
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

      const reconnectDelay = this.delay;
      this.delay = this.delay === 0 ? RETRY_DELAY_MS : Math.min(this.delay + RETRY_DELAY_MS, MAX_RETRY_DELAY_MS);

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

    return events;
  };
}

// Instantiated for side-effects: establishes the SSE connection on import.
export const VERSION_CONNECTION = new VersionConnection();
