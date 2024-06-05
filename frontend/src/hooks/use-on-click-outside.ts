import { RefObject, useEffect } from 'react';

type Callback = (event: MouseEvent | TouchEvent | KeyboardEvent) => void;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: Callback,
  children = false,
) =>
  useEffect(() => {
    const mouseListener = (event: MouseEvent | TouchEvent) => {
      if (ref.current === null) {
        return;
      }

      if (event.target instanceof window.Node) {
        const { target } = event;

        if (children && Array.from(ref.current.children).every((e) => !e.contains(target))) {
          callback(event);
        } else if (!ref.current.contains(target)) {
          callback(event);
        }
      }
    };

    const escapeListener = (event: KeyboardEvent) => {
      if (ref.current === null) {
        return;
      }

      if (event.key === 'Escape') {
        callback(event);
      }
    };

    window.addEventListener('mousedown', mouseListener);
    document.addEventListener('touchstart', mouseListener);
    window.addEventListener('keydown', escapeListener);

    return () => {
      window.removeEventListener('mousedown', mouseListener);
      document.removeEventListener('touchstart', mouseListener);
      window.removeEventListener('keydown', escapeListener);
    };
  }, [callback, ref, children]);
