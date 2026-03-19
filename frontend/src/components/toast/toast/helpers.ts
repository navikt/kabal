import { CLOSE_TOAST_EVENT_TYPE } from '@/components/toast/toast/constants';
import type { Message, TimedMessage } from '@/components/toast/types';

export const sendCloseEvent = (target: EventTarget) =>
  target.dispatchEvent(new Event(CLOSE_TOAST_EVENT_TYPE, { bubbles: true }));

export const isTimedToast = (message: Message): message is TimedMessage => Object.hasOwn(message, 'timeout');
