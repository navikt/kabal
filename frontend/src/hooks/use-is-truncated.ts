import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Detects whether an element's text content is truncated with ellipsis.
 * Works by comparing the element's scrollWidth to its clientWidth, which means it really detects horizontal overflow.
 *
 * The caller is responsible for ensuring the element has CSS truncation styles
 * (e.g. Tailwind's `truncate` - `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`).
 *
 * Returns a `[isTruncated, ref]` tuple. Attach the ref to the element you want to observe.
 * The boolean updates reactively when the element resizes.
 */
export const useIsTruncated = (disabled = false): [boolean, React.RefCallback<HTMLElement>] => {
  const [isTruncated, setIsTruncated] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback(
    (element: HTMLElement | null) => {
      if (observerRef.current !== null) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (disabled) {
        return;
      }

      if (element === null) {
        setIsTruncated(false);

        return;
      }

      const checkTruncation = () => {
        setIsTruncated(element.scrollWidth > element.clientWidth);
      };

      checkTruncation();

      observerRef.current = new ResizeObserver(checkTruncation);
      observerRef.current.observe(element);
    },
    [disabled],
  );

  useEffect(
    () => () => {
      observerRef.current?.disconnect();
    },
    [],
  );

  return [isTruncated, ref];
};
