import type { RefObject } from 'react';

export const scrollPopoverIntoView = (
  scrollContainerRef: RefObject<HTMLElement | null> | undefined,
  popoverRef: RefObject<HTMLDivElement | null>,
): number | null => {
  const container = scrollContainerRef?.current;
  const popover = popoverRef.current;

  if (container === null || container === undefined || popover === null) {
    return null;
  }

  const containerRect = container.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const overflow = popoverRect.bottom - containerRect.bottom + 16; // 16px margin

  if (overflow > 0) {
    requestAnimationFrame(() => {
      container.scrollBy({ top: overflow, behavior: 'smooth' });
    });

    return overflow;
  }

  return null;
};
