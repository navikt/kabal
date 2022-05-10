import { useEffect, useState } from 'react';

export const useDebounced = <V>(
  savedValue: V,
  fn: (value: V) => void,
  delay = 1000
): [V, React.Dispatch<React.SetStateAction<V>>] => {
  const [debouncedValue, setDebouncedValue] = useState<V>(savedValue);

  useEffect(() => setDebouncedValue(savedValue), [savedValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (debouncedValue !== savedValue) {
        fn(debouncedValue);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, fn, debouncedValue, savedValue]);

  return [debouncedValue, setDebouncedValue];
};
