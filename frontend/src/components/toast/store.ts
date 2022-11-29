import { SLIDE_DURATION, TOAST_TIMEOUT } from './constants';
import { NewMessage } from './types';

type ListenerFn = (messages: Message[]) => void;
export interface Message extends NewMessage {
  id: string;
  createdAt: number;
  expiresAt: number;
  close: () => void;
  setExpiresAt: (ms: number) => void;
}

class Store {
  private messages: Message[] = [];
  private listeners: ListenerFn[] = [];

  private notify() {
    this.listeners.forEach((listener) => listener(this.messages));
  }

  public subscribe(listener: ListenerFn) {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
    listener(this.messages);
  }

  public unsubscribe(listener: ListenerFn) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  public addMessage(message: NewMessage) {
    const createdAt = Date.now();
    const expiresAt = createdAt + TOAST_TIMEOUT;
    const id = `${message.type}-${createdAt}-${Math.random()}`;

    const timeout = setTimeout(() => this.removeMessage(id), TOAST_TIMEOUT);
    const setExpiresAt = (ms: number) => this.setExpiresAt(id, ms, timeout);

    const close = () => setExpiresAt(Date.now() + SLIDE_DURATION);

    this.messages = [
      ...this.messages,
      {
        ...message,
        id,
        createdAt,
        expiresAt,
        close,
        setExpiresAt,
      },
    ];

    this.notify();
  }

  private setExpiresAt(id: string, expiresAt: number, previousTimer: NodeJS.Timeout | null) {
    if (previousTimer !== null) {
      clearTimeout(previousTimer);
    }

    this.messages = this.messages.map((message) => {
      if (message.id === id) {
        const timeout =
          expiresAt === Infinity ? null : setTimeout(() => this.removeMessage(id), expiresAt - Date.now());

        const setExpiresAt = (ms: number) => this.setExpiresAt(id, ms, timeout);

        return {
          ...message,
          expiresAt,
          setExpiresAt,
        };
      }

      return message;
    });

    this.notify();
  }

  private removeMessage(id: string) {
    this.messages = this.messages.filter((m) => m.id !== id);
    this.notify();
  }

  private removeExpiredMessages() {
    const now = Date.now();
    this.messages = this.messages.filter((m) => m.expiresAt > now);
    this.notify();
  }
}

const toastStore = new Store();

export const toast = toastStore.addMessage.bind(toastStore);
export const subscribe = toastStore.subscribe.bind(toastStore);
export const unsubscribe = toastStore.unsubscribe.bind(toastStore);
