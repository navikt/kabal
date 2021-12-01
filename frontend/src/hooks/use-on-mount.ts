import { useEffect, useRef } from 'react';

export const useOnMount = (callback: () => void) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      callback();
    }
  }, [mounted, callback]);
};
