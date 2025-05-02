import { Observable } from '@app/observable';
import { useSyncExternalStore } from 'react';

type Value = readonly string[];

const INITIAL_ID_LIST: Value = [];

const store = new Observable<Value>(INITIAL_ID_LIST);

export const useShowVedlegg = () => useSyncExternalStore(store.subscribe, store.get);

export const resetShowVedleggIdList = () => store.set(INITIAL_ID_LIST);

export const getShowVedlegg = store.get;

export const setShowVedlegg = store.set;

export const hasShownVedlegg = (journalpostId: string) => getShowVedlegg().includes(journalpostId);
