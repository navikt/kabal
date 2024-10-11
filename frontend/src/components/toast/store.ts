import { TOAST_DEFAULT_TIMEOUT } from '@app/components/toast/constants';
import {
  type CloseFn,
  type ListenerFn,
  type Message,
  type TimedMessage,
  ToastType,
  type UntimedMessage,
} from '@app/components/toast/types';

class Store {
  private messages: Message[] = [];
  private listeners: ListenerFn[] = [];

  public subscribe(listener: ListenerFn) {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }

    listener(this.messages);

    return () => this.unsubscribe(listener);
  }

  public unsubscribe(listener: ListenerFn) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  public success = (content: React.ReactNode, timeout?: number) => this.addMessage(ToastType.SUCCESS, content, timeout);
  public error = (content: React.ReactNode, timeout?: number) => this.addMessage(ToastType.ERROR, content, timeout);
  public warning = (content: React.ReactNode, timeout?: number) => this.addMessage(ToastType.WARNING, content, timeout);
  public info = (content: React.ReactNode, timeout?: number) => this.addMessage(ToastType.INFO, content, timeout);

  private notify() {
    for (const listener of this.listeners) {
      listener(this.messages);
    }
  }

  private addMessage(type: ToastType, content: React.ReactNode, timeout = TOAST_DEFAULT_TIMEOUT): CloseFn {
    const createdAt = Date.now();
    const id = crypto.randomUUID();
    const close: CloseFn = () => this.removeMessage(id);

    this.messages = [
      ...this.messages,
      Number.isFinite(timeout)
        ? ({
            type,
            content,
            id,
            createdAt,
            close,
            expiresAt: createdAt + timeout,
            setExpiresAt: (ms: number) => this.setExpiresAt(id, ms),
            timeout,
          } satisfies TimedMessage)
        : ({
            type,
            content,
            id,
            createdAt,
            close,
          } satisfies UntimedMessage),
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
