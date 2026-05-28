import { ENVIRONMENT } from '@/environment';

export type IdleState = 'active' | 'idle';

type IdleStateListener = (state: IdleState) => void;

const IDLE_TIMEOUT_MS = ENVIRONMENT.isLocal ? 30 * 1_000 : 15 * 60 * 1_000; // 15 minutes
const ACTIVITY_DEBOUNCE_MS = 30_000; // 30 seconds
const CHECK_INTERVAL_MS = 60_000; // 60 seconds

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll', 'mousemove', 'touchstart'] as const;

class IdleTracker {
  private state: IdleState = 'active';
  private lastActivityTime = Date.now();
  private listeners: IdleStateListener[] = [];
  private activityDebouncing = false;

  constructor() {
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, this.onActivity, { passive: true });
    }

    document.addEventListener('visibilitychange', this.onVisibilityChange);

    // Page Lifecycle API — freeze fires when the browser suspends the tab,
    // at which point setInterval stops running. Handle it explicitly here.
    // These events are dispatched on `document` with bubbles:false and do not
    // reach `window`, so they must be attached to document.
    document.addEventListener('freeze', this.onFreeze);
    document.addEventListener('resume', this.onResume);

    setInterval(this.checkIdle, CHECK_INTERVAL_MS);
  }

  public getState = (): IdleState => this.state;

  public subscribe = (listener: IdleStateListener): void => {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  };

  public unsubscribe = (listener: IdleStateListener): void => {
    this.listeners = this.listeners.filter((l) => l !== listener);
  };

  private setState = (newState: IdleState): void => {
    if (this.state === newState) {
      return;
    }

    this.state = newState;

    for (const listener of this.listeners) {
      listener(newState);
    }
  };

  private onActivity = (): void => {
    if (this.state === 'idle') {
      // User returned — transition immediately without waiting for the interval
      this.lastActivityTime = Date.now();
      this.setState('active');

      return;
    }

    if (this.activityDebouncing) {
      return;
    }

    // Only update lastActivityTime at most once per ACTIVITY_DEBOUNCE_MS
    // to avoid expensive Date.now() calls on every mousemove
    this.lastActivityTime = Date.now();
    this.activityDebouncing = true;

    setTimeout(() => {
      this.activityDebouncing = false;
    }, ACTIVITY_DEBOUNCE_MS);
  };

  private onVisibilityChange = (): void => {
    if (document.hidden) {
      // Tab became hidden — activity events will stop firing.
      // The interval check will catch idle after IDLE_TIMEOUT_MS.
      // If timers are suspended, the freeze event will handle it.
      return;
    }

    // Tab became visible — check if idle time has already elapsed
    // (handles the case where timers were suspended while hidden).
    const idleTime = Date.now() - this.lastActivityTime;

    if (idleTime >= IDLE_TIMEOUT_MS) {
      this.setState('idle');

      return;
    }

    // If the user returns to a visible tab before the timeout, transition
    // back to active in case the interval had fired while hidden.
    if (this.state === 'idle') {
      this.lastActivityTime = Date.now();
      this.setState('active');
    }
  };

  private onFreeze = (): void => {
    // Browser is suspending the tab — transition to idle immediately since
    // the interval will not fire while frozen.
    this.setState('idle');
  };

  private onResume = (): void => {
    // Browser resumed the tab from a frozen state.
    this.lastActivityTime = Date.now();
    this.setState('active');
  };

  private checkIdle = (): void => {
    if (this.state === 'idle') {
      return;
    }

    const idleTime = Date.now() - this.lastActivityTime;

    if (idleTime >= IDLE_TIMEOUT_MS) {
      this.setState('idle');
    }
  };
}

export const IDLE_TRACKER = new IdleTracker();
