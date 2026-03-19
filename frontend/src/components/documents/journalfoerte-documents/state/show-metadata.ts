import { useSyncExternalStore } from 'react';
import { Observable } from '@/observable';

type Value = string[];

const INITIAL_ID_LIST: Value = [];

const store = new Observable<Value>(INITIAL_ID_LIST);

export const useShowMetadata = () => useSyncExternalStore(store.subscribe, store.get);

export const resetShowMetadata = () => store.set(INITIAL_ID_LIST);

export const getShowMetadata = store.get;

export const setShowMetadata = store.set;
