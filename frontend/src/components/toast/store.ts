import { TOAST_TIMEOUT } from './constants';
import { NewMessage, ToastType } from './types';

type ListenerFn = (messages: Message[]) => void;

type CloseFn = () => void;

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
  public error = (message: React.ReactNode, timeout?: number) => this.addMessage(ToastType.ERROR, message, timeout);
  public warning = (message: React.ReactNode, timeout?: number) => this.addMessage(ToastType.WARNING, message, timeout);
  public info = (message: React.ReactNode, timeout?: number) => this.addMessage(ToastType.INFO, message, timeout);

  private notify() {
    this.listeners.forEach((listener) => listener(this.messages));
  }

  private addMessage(type: ToastType, message: React.ReactNode, timeout: number = TOAST_TIMEOUT): CloseFn {
    const createdAt = Date.now();
    const expiresAt = createdAt + timeout;
    const id = crypto.randomUUID();

    const setExpiresAt = (ms: number) => this.setExpiresAt(id, ms);

    const close: CloseFn = () => this.removeMessage(id);

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

    return close;
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
}

export const toast = new Store();
