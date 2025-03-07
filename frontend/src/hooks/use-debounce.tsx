import { useEffect } from 'react';

export const useDebounce = (action: () => void, delay: number, skip?: boolean) => {
  useEffect(() => {
    if (skip) {
      return;
    }

    const timeout = setTimeout(action, delay);

    return () => clearTimeout(timeout);
  }, [action, delay, skip]);
};
