import { isObject } from '@app/functions/object';
import { isApiError } from '@app/types/errors';
import { useEffect } from 'react';

export const useDebounce = (
  action: () => Promise<unknown>,
  delay: number,
  skip: boolean,
  setError: (e: string | undefined) => void,
) => {
  useEffect(() => {
    if (skip) {
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        await action();
        setError(undefined);
      } catch (e) {
        setErrorMessage(e, setError);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [action, delay, skip, setError]);
};

export const setErrorMessage = (e: unknown, setError: (e: string) => void, fallbackMessage = 'Ukjent feil') => {
  if (isObject(e) && 'data' in e && isApiError(e.data)) {
    setError(e.data.title);
  } else {
    setError(fallbackMessage);
  }
};
