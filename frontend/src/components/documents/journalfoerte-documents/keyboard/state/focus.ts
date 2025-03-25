import { convertRealToAccessibleDocumentIndex } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { Observable } from '@app/observable';
import { useSyncExternalStore } from 'react';

type SetFn<T> = (state: T) => T;
type Setter<T> = T | SetFn<T>;

const INITIAL_INDEX = -1;
const INITIAL_PATH: [number, number] = [INITIAL_INDEX, INITIAL_INDEX];

type Path = [number, number];

const focusStore = new Observable<Path>(INITIAL_PATH, ([a1, a2], [b1, b2]) => a1 === b1 && a2 === b2);

export const resetIndexes = () => focusStore.set(INITIAL_PATH);

export const useKeyboardFocusState = () => useSyncExternalStore(focusStore.subscribe, focusStore.get);

export const useIsKeyboardActive = () => {
  const [accessibleDocumentIndex] = useKeyboardFocusState();

  return accessibleDocumentIndex !== INITIAL_INDEX;
};

export const setAccessibleDocumentIndex = (accessibleDocumentIndex: Setter<number>) =>
  focusStore.set(([dIndex, vIndex]) => [
    typeof accessibleDocumentIndex === 'function' ? accessibleDocumentIndex(dIndex) : accessibleDocumentIndex,
    vIndex,
  ]);

export const setFocusedVedleggIndex = (focusedVedleggIndex: Setter<number>) =>
  focusStore.set(([dIndex, vIndex]) => [
    dIndex,
    typeof focusedVedleggIndex === 'function' ? focusedVedleggIndex(vIndex) : focusedVedleggIndex,
  ]);

export const setFocusPath = (...path: Path) => focusStore.set(path);

export const getAccessibleDocumentIndex = () => focusStore.get()[0];
export const getFocusedVedleggIndex = () => focusStore.get()[1];
export const getIsInVedleggList = () => getFocusedVedleggIndex() !== INITIAL_INDEX;

export const setRealDocumentIndex = (index: number) => {
  const accessibleDocumentIndex = convertRealToAccessibleDocumentIndex(index);

  if (accessibleDocumentIndex === null) {
    return false;
  }

  setAccessibleDocumentIndex(accessibleDocumentIndex);
  return true;
};

export const setRealDocumentPath = (d: number, v: number) => {
  if (setRealDocumentIndex(d)) {
    setFocusedVedleggIndex(v);
  }
};
