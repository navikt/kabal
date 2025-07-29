import { Observable } from '@app/observable';
import { user } from '@app/static-data/static-data';
import { useSyncExternalStore } from 'react';

// System

const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';

const INITIAL_SYSTEM_DARK_MODE = hasMatchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const systemDarkModeStore = new Observable<boolean>(INITIAL_SYSTEM_DARK_MODE);

const setSystemDarkMode = (darkMode: boolean) => systemDarkModeStore.set(darkMode);

export const getSystemDarkMode = () => systemDarkModeStore.get();

if (hasMatchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    setSystemDarkMode(event.matches);
  });
}

// User

const parseDarkModeValue = (value: string | null): boolean | null => {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return null;
  }
};

const LOCALSTORAGE_KEY = `${(await user).navIdent}/darkmode`;

const getLocalStorageDarkMode = async (): Promise<boolean | null> =>
  parseDarkModeValue(localStorage.getItem(LOCALSTORAGE_KEY));

const userDarkModeStore = new Observable<boolean | null>(await getLocalStorageDarkMode());

export const setUserDarkMode = (darkMode: boolean | null) => userDarkModeStore.set(darkMode);

export const getUserDarkMode = () => userDarkModeStore.get();

window.addEventListener('storage', async (event) => {
  if (event.key === LOCALSTORAGE_KEY) {
    setUserDarkMode(parseDarkModeValue(event.newValue));
  }
});

// Combined

export const darkModeStore = new Observable<boolean>(getUserDarkMode() ?? getSystemDarkMode());

export const getDarkMode = () => darkModeStore.get();

userDarkModeStore.subscribe((userDarkMode) => {
  if (userDarkMode === null) {
    darkModeStore.set(getSystemDarkMode());
  } else {
    darkModeStore.set(userDarkMode);
  }
});

systemDarkModeStore.subscribe((systemDarkMode) => {
  if (getUserDarkMode() === null) {
    darkModeStore.set(systemDarkMode);
  }
});

export const useDarkMode = () => useSyncExternalStore(darkModeStore.subscribe, darkModeStore.get);
