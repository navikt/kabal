import { IS_LOCALHOST } from '@app/redux-api/common';

type UserActivityListener = (active: boolean) => void;

const INACTIVITY_THRESHOLD = IS_LOCALHOST ? 5 * 1_000 : 5 * 60 * 1_000; // 5 minutes (5 seconds on localhost for development)

const startInactivityTimer = (callback: () => void) => setTimeout(callback, INACTIVITY_THRESHOLD);

/**
 * Marks tabs as inactive when the user is not interacting with the page for a certain period of time.
 * Zero to many tabs may be active at the same time.
 * It does not track the visibility state of the tabs, as this is different from user activity.
 * A user may work actively with multiple tabs.
 */
class UserActivity {
  private listeners: UserActivityListener[] = [];
  private isActive = !document.hidden;
  private timeout: NodeJS.Timeout | null = document.hidden ? null : startInactivityTimer(() => this.setInactive());

  constructor() {
    window.addEventListener('mousemove', () => this.setActive());
    window.addEventListener('keydown', () => this.setActive());
    window.addEventListener('keyup', () => this.setActive());
    window.addEventListener('scroll', () => this.setActive());
  }

  private setActive = () => {
    if (this.isActive) {
      // If the user is already active, do nothing.
      return;
    }

    this.isActive = true;
    if (this.timeout !== null) {
      clearTimeout(this.timeout); // Make sure there is no timeout left running in the background, without any handle.
    }
    this.timeout = startInactivityTimer(() => this.setInactive());
    this.notifyListeners();
  };

  private setInactive = () => {
    if (!this.isActive) {
      // If the user is already inactive, do nothing.
      return;
    }

    this.isActive = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.notifyListeners();
  };

  private notifyListeners = () => {
    for (const listener of this.listeners) {
      listener(this.isActive);
    }
  };

  public addListener = (listener: UserActivityListener) => {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }

    return () => this.removeListener(listener);
  };

  public removeListener = (listener: UserActivityListener) => {
    this.listeners = this.listeners.filter((l) => l !== listener);
  };
}

export const USER_ACTIVITY = new UserActivity();
