import { useEffect } from 'react';

const CHANNEL = new BroadcastChannel('inline-pdf-channel');

export const useBroadcastEvents = (onEvent: (event: KeyDownEvent) => void) => {
  useEffect(() => {
    const listener = ({ data }: MessageEvent<unknown>) => {
      console.debug('Received event:', data);
      if (isKeyDownEvent(data)) {
        onEvent(data);
      }
    };

    CHANNEL.addEventListener('message', listener);

    return () => {
      CHANNEL.removeEventListener('message', listener);
    };
  }, [onEvent]);
};

interface KeyDownEvent {
  type: 'keydown';
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

const isKeyDownEvent = (data: unknown): data is KeyDownEvent =>
  typeof data === 'object' &&
  data !== null &&
  'type' in data &&
  data.type === 'keydown' &&
  'key' in data &&
  typeof data.key === 'string' &&
  'metaKey' in data &&
  typeof data.metaKey === 'boolean' &&
  'ctrlKey' in data &&
  typeof data.ctrlKey === 'boolean' &&
  'shiftKey' in data &&
  typeof data.shiftKey === 'boolean' &&
  'altKey' in data &&
  typeof data.altKey === 'boolean';
