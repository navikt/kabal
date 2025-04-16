import { Observable } from '@app/observable';
import { useSyncExternalStore } from 'react';

type Value = string[];

const INITIAL_ID_LIST: Value = [];

const store = new Observable<Value>(
  INITIAL_ID_LIST,
  (a, b) => a.length === b.length && a.every((id) => b.includes(id)),
);

const resetShowVedleggIdList = () => store.set(INITIAL_ID_LIST);

export const useShowVedlegg = () => {
  const showVedleggIdList = useSyncExternalStore<Value>(store.subscribe, store.get);
  const setShowVedleggIdList = store.set;

  return { showVedleggIdList, setShowVedleggIdList, resetShowVedleggIdList };
};

export const getShowVedlegg = () => store.get();

export const setShowVedlegg = store.set;
