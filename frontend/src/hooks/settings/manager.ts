type ListenerFn = (value: string | undefined) => void;
type ListenerMap = Record<string, ListenerFn[]>;

type UnsubscribeFn = () => void;

class SettingsManager {
  private listeners: ListenerMap = {};
  private settings: Record<string, string> = {};

  constructor() {
    addEventListener('storage', (event) => {
      if (event.storageArea !== window.localStorage) {
        return;
      }

      const { key, newValue } = event;

      if (key === null) {
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

  public set = (key: string, value: string): void => {
    this.notify(key, value);

    this.settings[key] = value;
    setTimeout(() => window.localStorage.setItem(key, value), 0);
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
      callback(this.get(key));
    } else if (!listeners.includes(callback)) {
      this.listeners[key] = [...listeners, callback];
      callback(this.get(key));
    }

    return () => this.unsubscribe(key, callback);
  };

  public unsubscribe = (key: string, callback: ListenerFn): void => {
    this.listeners[key] = this.listeners[key]?.filter((listener) => listener !== callback) ?? [];
  };
}

export const SETTINGS_MANAGER = new SettingsManager();
