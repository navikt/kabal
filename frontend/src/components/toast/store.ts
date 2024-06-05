import { TOAST_TIMEOUT } from './constants';
import { NewMessage, ToastType } from './types';

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

  public subscribe(listener: ListenerFn) {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
    listener(this.messages);
  }

  public unsubscribe(listener: ListenerFn) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  public success = (message: React.ReactNode, timeout?: number) => this.addMessage(ToastType.SUCCESS, message, timeout);
  public error = (message: React.ReactNode) => this.addMessage(ToastType.ERROR, message);
  public warning = (message: React.ReactNode) => this.addMessage(ToastType.WARNING, message);
  public info = (message: React.ReactNode) => this.addMessage(ToastType.INFO, message);

  private notify() {
    this.listeners.forEach((listener) => listener(this.messages));
  }

  private addMessage(type: ToastType, message: React.ReactNode, timeout: number = TOAST_TIMEOUT) {
    const createdAt = Date.now();
    const expiresAt = createdAt + timeout;
    const id = crypto.randomUUID();

    const setExpiresAt = (ms: number) => this.setExpiresAt(id, ms);

    const close = () => this.removeMessage(id);

    this.messages = [
      ...this.messages,
      {
        type,
        message,
        id,
        createdAt,
        expiresAt,
        close,
        setExpiresAt,
      },
    ];

    this.notify();
  }

  private setExpiresAt(id: string, expiresAt: number) {
    this.messages = this.messages.map((message) => {
      if (message.id === id) {
        const setExpiresAt = (ms: number) => this.setExpiresAt(id, ms);

        return { ...message, expiresAt, setExpiresAt };
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

export const toast = new Store();
