import { useSyncExternalStore } from 'react';
import { Observable } from '@/observable';

const isPanelKeyboardHelpModalOpenStore = new Observable(false);

export const useIsPanelKeyboardHelpModalOpen = () =>
  useSyncExternalStore(isPanelKeyboardHelpModalOpenStore.subscribe, isPanelKeyboardHelpModalOpenStore.get);

export const openPanelKeyboardHelpModal = () => isPanelKeyboardHelpModalOpenStore.set(true);
export const closePanelKeyboardHelpModal = () => isPanelKeyboardHelpModalOpenStore.set(false);
export const togglePanelKeyboardHelpModal = () => isPanelKeyboardHelpModalOpenStore.set((current) => !current);
