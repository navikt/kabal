import type { reduxStore } from '@/redux/configure-store';

let store: typeof reduxStore | null = null;

export const setStoreRef = (s: typeof reduxStore) => {
  store = s;
};

export const getReduxStore = (): typeof reduxStore => {
  if (store === null) {
    throw new Error('Redux store not initialized. Ensure setStoreRef is called in configure-store.ts.');
  }

  return store;
};
