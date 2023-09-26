import { RefObject, useEffect } from 'react';

type Callback = (event: MouseEvent | TouchEvent | KeyboardEvent | Event) => void;

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

      if (event.target instanceof global.Node) {
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
    window.addEventListener('touchstart', mouseListener);
    window.addEventListener('keydown', escapeListener);
    window.addEventListener('contextmenu', mouseListener);
    window.addEventListener(SMART_EDITOR_CONTEXT_MENU_EVENT_TYPE, callback);

    return () => {
      window.removeEventListener('mousedown', mouseListener);
      window.removeEventListener('touchstart', mouseListener);
      window.removeEventListener('keydown', escapeListener);
      window.removeEventListener('contextmenu', mouseListener);
      window.removeEventListener(SMART_EDITOR_CONTEXT_MENU_EVENT_TYPE, callback);
    };
  }, [callback, ref, children]);

export const SMART_EDITOR_CONTEXT_MENU_EVENT_TYPE = 'smarteditor:contextmenu';
