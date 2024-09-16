export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export type ListenerFn = (messages: Message[]) => void;

export type CloseFn = () => void;

export interface UntimedMessage {
  id: string;
  createdAt: number;
  content: React.ReactNode;
  type: ToastType;
  close: () => void;
}

export interface TimedMessage extends UntimedMessage {
  expiresAt: number;
  setExpiresAt: (ms: number) => void;
  /** Total timeout from createdAt in milliseconds */
  timeout: number;
}

export type Message = UntimedMessage | TimedMessage;
