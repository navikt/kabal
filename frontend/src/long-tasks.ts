import { pushMeasurement } from '@/observability';

/**
 * Observes long tasks (>50ms) using the PerformanceObserver API
 * and reports them as Faro measurements.
 */
export const initLongTaskObserver = (): void => {
  if (typeof PerformanceObserver === 'undefined') {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        pushMeasurement({
          type: 'long_task',
          values: {
            duration: Math.round(entry.duration),
          },
        });
      }
    });

    observer.observe({ type: 'longtask', buffered: true });
  } catch {
    // PerformanceObserver for 'longtask' not supported in this browser.
  }
};
