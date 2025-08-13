import { Observable } from '@app/observable';

const keyboardActiveStore = new Observable<boolean>(false);

export const resetKeyboardActive = () => keyboardActiveStore.set(false);

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
