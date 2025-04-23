import { Observable } from '@app/observable';
import { useSyncExternalStore } from 'react';

const keyboardActiveStore = new Observable<boolean>(false);

export const useKeyboardActiveState = () =>
  useSyncExternalStore(keyboardActiveStore.subscribe, keyboardActiveStore.get);

export const getKeyboardActive = () => keyboardActiveStore.get();

let setTimeoutId: NodeJS.Timeout | null = null;

export const setKeyboardActive = (isActive: boolean) => {
  if (setTimeoutId !== null) {
    clearTimeout(setTimeoutId);
  }

  setTimeoutId = setTimeout(() => {
    keyboardActiveStore.set(isActive);
    setTimeoutId = null;
  }, 100);
};
