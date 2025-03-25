import { Observable } from '@app/observable';
import { useSyncExternalStore } from 'react';

type Value = string[];

const INITIAL_ID_LIST: Value = [];

const store = new Observable<Value>(
  INITIAL_ID_LIST,
  (a, b) => a.length === b.length && a.every((id) => b.includes(id)),
);

const resetShowMetadataIdList = () => store.set(INITIAL_ID_LIST);

export const useShowMetadata = () => {
  const showMetadataIdList = useSyncExternalStore<Value>(store.subscribe, store.get);
  const setShowMetadataIdList = store.set;

  return { showMetadataIdList, setShowMetadataIdList, resetShowMetadataIdList };
};

export const getShowMetadata = () => store.get();

export const setShowMetadata = store.set;
