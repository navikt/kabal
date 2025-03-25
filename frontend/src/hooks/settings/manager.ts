type ListenerFn = (value: string | undefined) => void;
type ListenerMap = Record<string, ListenerFn[]>;

type UnsubscribeFn = () => void;

type SetterFn = (oldValue: string | undefined) => string;
type Setter = string | SetterFn;

class SettingsManager {
  private listeners: ListenerMap = {};
  private settings: Record<string, string> = {};
  private syncedSettings: Set<string> = new Set();

  constructor() {
    addEventListener('storage', (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage) {
        return;
      }

      const { key, newValue } = event;

      if (key === null || !this.syncedSettings.has(key)) {
        return;
      }

      const existing = this.get(key);

      if (newValue === null) {
        if (typeof existing === 'string') {
          this.remove(key);
        }

        return;
      }

      if (existing === newValue) {
        return;
      }

      this.set(key, newValue);
    });
  }

  private notify = (key: string, value: string | undefined): void => {
    const listeners = this.listeners[key];

    if (listeners === undefined) {
      return;
    }

    for (const listener of listeners) {
      listener(value);
    }
  };

  public get = (key: string | null): string | undefined => {
    if (key === null) {
      return undefined;
    }

    const existing = this.settings[key];

    if (typeof existing === 'string') {
      return existing;
    }

    const value = window.localStorage.getItem(key);

    if (value !== null) {
      if (existing !== value) {
        this.settings[key] = value;
      }

      return value;
    }

    return undefined;
  };

  public set = (key: string, value: Setter): void => {
    const newValue = typeof value === 'function' ? value(this.settings[key]) : value;

    if (newValue === this.settings[key]) {
      return;
    }

    this.notify(key, newValue);

    this.settings[key] = newValue;
    setTimeout(() => window.localStorage.setItem(key, newValue), 0);
  };

  public remove = (key: string): void => {
    this.notify(key, undefined);

    delete this.settings[key];
    setTimeout(() => window.localStorage.removeItem(key), 0);
  };

  public subscribe = (key: string, callback: ListenerFn): UnsubscribeFn => {
    const listeners = this.listeners[key];

    if (listeners === undefined) {
      this.listeners[key] = [callback];
    } else if (!listeners.includes(callback)) {
      this.listeners[key] = [...listeners, callback];
    }

    return () => this.unsubscribe(key, callback);
  };

  public unsubscribe = (key: string, callback: ListenerFn): void => {
    this.listeners[key] = this.listeners[key]?.filter((listener) => listener !== callback) ?? [];
  };

  public enableSync = (key: string): Set<string> => this.syncedSettings.add(key);
  public disableSync = (key: string): boolean => this.syncedSettings.delete(key);
}

export const SETTINGS_MANAGER = new SettingsManager();
