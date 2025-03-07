import { isObject } from '@app/functions/object';
import { isApiError } from '@app/types/errors';
import { useEffect, useState } from 'react';

export const useDebounce = <T extends string | number | null>(
  /** The action to debounce */
  action: () => Promise<unknown>,
  /** Don't execute action if skip === true */
  skip: boolean,
  /** The value to be set. Only used to stop execution if action errors */
  value: T,
  /** The setter for the consumer's error message */
  setError: (e: string | undefined) => void,
  /** Delay in ms */
  delay: number,
) => {
  const [errorValue, setErrorValue] = useState<T>();

  useEffect(() => {
    if (skip || value === errorValue) {
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        await action();
        setError(undefined);
      } catch (e) {
        setErrorValue(value);
        setErrorMessage(e, setError);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [action, delay, skip, setError, value, errorValue]);
};

export const setErrorMessage = (e: unknown, setError: (e: string) => void, fallbackMessage = 'Ukjent feil') => {
  if (isObject(e) && 'data' in e && isApiError(e.data)) {
    setError(e.data.title);
  } else {
    setError(fallbackMessage);
  }
};
