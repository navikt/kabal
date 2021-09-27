import { RefObject, useEffect } from 'react';

type Callback = (event: MouseEvent | TouchEvent) => void;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  callback: Callback,
  ref: RefObject<T>,
  children = false
) =>
  useEffect(() => {
    const listener: Callback = (event) => {
      if (ref.current === null) {
        return;
      }

      if (event.target instanceof Node) {
        const { target } = event;
        if (children && Array.from(ref.current.children).every((e) => !e.contains(target))) {
          callback(event);
        } else if (!ref.current.contains(target)) {
          callback(event);
        }
      }
    };

    window.addEventListener('mousedown', listener);
    document.addEventListener(`touchstart`, listener);

    return () => {
      window.removeEventListener('mousedown', listener);
      document.removeEventListener(`touchstart`, listener);
    };
  }, [callback, ref, children]);
