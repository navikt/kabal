import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface DynamicContentLoadingContextValue {
  /** Number of dynamic components currently performing their initial load. */
  loadingCount: number;
  /** Register a dynamic component as loading. Returns a function to call when loading is complete. */
  registerLoading: () => () => void;
}

const DynamicContentLoadingContext = createContext<DynamicContentLoadingContextValue>({
  loadingCount: 0,
  registerLoading: () => () => undefined,
});

/**
 * Provider that tracks how many dynamic content components are currently performing their initial load.
 *
 * Components register via `registerLoading()` and call the returned function when done.
 * The raw `loadingCount` is exposed so consumers can decide how to interpret it.
 */
export const DynamicContentLoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const registerLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1);

    let stopped = false;

    return () => {
      if (stopped) {
        return;
      }

      stopped = true;
      setLoadingCount((prev) => Math.max(0, prev - 1));
    };
  }, []);

  return (
    <DynamicContentLoadingContext value={{ loadingCount, registerLoading }}>{children}</DynamicContentLoadingContext>
  );
};

/**
 * Returns the number of dynamic components currently loading.
 */
export const useDynamicContentLoadingCount = (): number => useContext(DynamicContentLoadingContext).loadingCount;

/**
 * Hook for dynamic components to report their loading state.
 *
 * Automatically increments the loading counter when `isLoading` becomes `true`
 * and decrements it when `isLoading` becomes `false` or on unmount.
 */
export const useReportDynamicContentLoading = (isLoading: boolean): void => {
  const { registerLoading } = useContext(DynamicContentLoadingContext);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isLoading) {
      if (stopRef.current === null) {
        stopRef.current = registerLoading();
      }
    } else {
      if (stopRef.current !== null) {
        stopRef.current();
        stopRef.current = null;
      }
    }
  }, [isLoading, registerLoading]);

  // Cleanup on unmount.
  useEffect(
    () => () => {
      if (stopRef.current !== null) {
        stopRef.current();
        stopRef.current = null;
      }
    },
    [],
  );
};
