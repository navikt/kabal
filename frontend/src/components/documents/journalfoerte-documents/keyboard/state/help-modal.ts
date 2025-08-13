import { Observable } from '@app/observable';
import { useSyncExternalStore } from 'react';

const isKeyboardHelpModalOpenStore = new Observable(false);

export const resetKeyboardHelpModal = () => isKeyboardHelpModalOpenStore.set(false);

export const useIsKeyboardHelpModalOpen = () =>
  useSyncExternalStore(isKeyboardHelpModalOpenStore.subscribe, isKeyboardHelpModalOpenStore.get);

export const openKeyboardHelpModal = () => isKeyboardHelpModalOpenStore.set(true);
export const closeKeyboardHelpModal = () => isKeyboardHelpModalOpenStore.set(false);
