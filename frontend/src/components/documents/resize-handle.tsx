import type { PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useRef } from 'react';
import { clamp } from '@/functions/clamp';

interface ResizeHandleProps {
  minWidth: number;
  setWidth: (width: number) => void;
}

export const ResizeHandle = ({ minWidth, setWidth }: ResizeHandleProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      e.preventDefault();
      const element = elementRef.current;
      const container = element?.parentElement;

      if (element === null || container === null || container === undefined) {
        return;
      }

      element.setPointerCapture(e.pointerId);

      const startX = e.clientX;
      const startWidth = container.clientWidth;
      let currentWidth = startWidth;
      let rafId: number | null = null;

      const previousUserSelect = document.body.style.userSelect;
      const previousCursor = document.body.style.cursor;

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';

      const cleanup = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }

        document.body.style.userSelect = previousUserSelect;
        document.body.style.cursor = previousCursor;
        element.removeEventListener('pointermove', onPointerMove);
        element.removeEventListener('pointerup', onPointerUp);
        element.removeEventListener('lostpointercapture', onLostPointerCapture);

        setWidth(currentWidth);
      };

      const onPointerMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        currentWidth = clamp(startWidth + deltaX, minWidth, window.innerWidth);

        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            container.style.width = `${currentWidth.toString(10)}px`;
            rafId = null;
          });
        }
      };

      const onPointerUp = () => cleanup();
      const onLostPointerCapture = () => cleanup();

      element.addEventListener('pointermove', onPointerMove);
      element.addEventListener('pointerup', onPointerUp);
      element.addEventListener('lostpointercapture', onLostPointerCapture);
    },
    [minWidth, setWidth],
  );

  return (
    <div
      ref={elementRef}
      aria-hidden
      className="group absolute top-0 right-0 bottom-0 z-50 flex w-2 cursor-col-resize select-none items-center justify-center"
      onPointerDown={handlePointerDown}
    >
      <div className="h-8 w-1 rounded-full bg-ax-border-neutral opacity-50 transition-opacity group-hover:opacity-100" />
    </div>
  );
};
