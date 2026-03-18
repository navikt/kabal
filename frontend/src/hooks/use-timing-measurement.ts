import { useEffect, useRef } from 'react';
import { pushMeasurement } from '@/observability';

/**
 * Measures the time from component mount to when `ready` becomes true.
 * Pushes a single Faro measurement with the given name.
 */
export const useTimingMeasurement = (name: string, ready: boolean): void => {
  const mountTime = useRef(performance.now());
  const reported = useRef(false);

  useEffect(() => {
    if (ready && !reported.current) {
      reported.current = true;
      const duration = Math.round(performance.now() - mountTime.current);

      pushMeasurement({
        type: 'user_flow_timing',
        values: { [name]: duration },
      });
    }
  }, [ready, name]);
};
