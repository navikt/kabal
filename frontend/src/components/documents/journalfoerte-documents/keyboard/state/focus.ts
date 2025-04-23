import { convertAccessibleToRealDocumentPath } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { Observable } from '@app/observable';
import { useSyncExternalStore } from 'react';

const INITIAL_INDEX = 0;

const focusStore = new Observable<number>(INITIAL_INDEX);

export const useKeyboardFocusState = () => useSyncExternalStore(focusStore.subscribe, focusStore.get);

export const resetFocusIndex = () => focusStore.set(INITIAL_INDEX);

export const setFocusIndex = (index = INITIAL_INDEX) => focusStore.set(index);

export const getFocusIndex = () => focusStore.get();

export const getIsInVedleggList = () => {
  const realPath = convertAccessibleToRealDocumentPath(focusStore.get());
  return realPath === null ? false : realPath[1] !== -1;
};

export const getFocusedVedleggIndex = () => {
  const realPath = convertAccessibleToRealDocumentPath(focusStore.get());
  return realPath === null ? -1 : realPath[1];
};
