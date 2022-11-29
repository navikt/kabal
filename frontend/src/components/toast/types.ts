export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export interface NewMessage {
  message: React.ReactNode;
  type: ToastType;
}
