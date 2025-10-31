import { type RefObject, useEffect, useState } from 'react';

export const useElementWidth = (ref: RefObject<HTMLElement | null>) => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    const element = ref.current;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
      resizeObserver.disconnect();
    };
  }, [ref]);

  return width;
};
