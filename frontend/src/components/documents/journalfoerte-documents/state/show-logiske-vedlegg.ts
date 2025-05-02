import { Observable } from '@app/observable';
import { useSyncExternalStore } from 'react';

type Value = string[];

const INITIAL_ID_LIST: Value = [];

const store = new Observable<Value>(INITIAL_ID_LIST);

export const useShowLogiskeVedlegg = () => useSyncExternalStore(store.subscribe, store.get);

export const resetShowLogiskeVedlegg = () => store.set(INITIAL_ID_LIST);

export const getShowLogiskeVedlegg = store.get;

export const setShowLogiskeVedlegg = store.set;
