import { Observable } from '@app/observable';
import { useMemo, useSyncExternalStore } from 'react';

const INITIAL_INDEX = -1;

const accessibleDocumentIndexStore = new Observable<number>(INITIAL_INDEX);
const focusedVedleggIndexStore = new Observable<number>(INITIAL_INDEX);

export const resetIndexes = () => {
  accessibleDocumentIndexStore.set(INITIAL_INDEX);
  focusedVedleggIndexStore.set(INITIAL_INDEX);
};

export const useAccessibleDocumentIndex = () =>
  useSyncExternalStore(accessibleDocumentIndexStore.subscribe, accessibleDocumentIndexStore.get);

export const useFocusedVedleggIndex = () =>
  useSyncExternalStore(focusedVedleggIndexStore.subscribe, focusedVedleggIndexStore.get);

export const useKeyboardFocusState = () => {
  const accessibleDocumentIndex = useAccessibleDocumentIndex();
  const focusedVedleggIndex = useFocusedVedleggIndex();

  return { accessibleDocumentIndex, focusedVedleggIndex };
};

export const useIsKeyboardActive = () => {
  const { accessibleDocumentIndex } = useKeyboardFocusState();

  return useMemo(() => accessibleDocumentIndex !== INITIAL_INDEX, [accessibleDocumentIndex]);
};

export const setAccessibleDocumentIndex = accessibleDocumentIndexStore.set;
export const setFocusedVedleggIndex = focusedVedleggIndexStore.set;
export const getAccessibleDocumentIndex = accessibleDocumentIndexStore.get;
export const getFocusedVedleggIndex = focusedVedleggIndexStore.get;
export const getIsInVedleggList = () => focusedVedleggIndexStore.get() !== INITIAL_INDEX;
