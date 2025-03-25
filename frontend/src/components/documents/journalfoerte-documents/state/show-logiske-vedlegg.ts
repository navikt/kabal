import { Observable } from '@app/observable';
import { useSyncExternalStore } from 'react';

type Value = string[];

const INITIAL_ID_LIST: Value = [];

const store = new Observable<Value>(
  INITIAL_ID_LIST,
  (a, b) => a.length === b.length && a.every((id) => b.includes(id)),
);

const resetShowLogiskeVedleggIdList = () => store.set(INITIAL_ID_LIST);

export const useShowLogiskeVedlegg = () => {
  const showLogiskeVedleggIdList = useSyncExternalStore<Value>(store.subscribe, store.get);
  const setShowLogiskeVedleggIdList = store.set;

  return { showLogiskeVedleggIdList, setShowLogiskeVedleggIdList, resetShowLogiskeVedleggIdList };
};
