import { Observable } from '@app/observable';
import { useSyncExternalStore } from 'react';

type Value = string[];

const INITIAL_ID_LIST: Value = [];

const store = new Observable<Value>(INITIAL_ID_LIST);

const resetShowLogiskeVedleggIdList = () => store.set(INITIAL_ID_LIST);

export const useShowLogiskeVedlegg = () => {
  const showLogiskeVedleggIdList = useSyncExternalStore(store.subscribe, store.get);
  const setShowLogiskeVedleggIdList = store.set;

  return { showLogiskeVedleggIdList, setShowLogiskeVedleggIdList, resetShowLogiskeVedleggIdList };
};
