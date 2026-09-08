import { type RefObject, useEffect } from 'react';
import { Keys } from '@/keys';

type Callback = (event: MouseEvent | TouchEvent | KeyboardEvent) => void;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  callback: Callback,
  children = false,
) =>
  useEffect(() => {
    const mouseListener = (event: MouseEvent | TouchEvent) => {
      if (ref.current === null) {
        return;
      }

      if (event.target instanceof window.Element) {
        const { target } = event;

        // Problem 1: a <Dialog> disables pointer-events on <body>, so clicks in/around it can land on
        // <html> - which used to make an outer PopupContainer's useOnClickOutside close immediately.
        // Problem 2: skipping this unconditionally would break useOnClickOutside for a popup nested
        // inside a dialog, so only skip it when ref itself is outside every dialog.
        if (target === document.documentElement && ref.current.closest('[role="dialog"]') === null) {
          return;
        }

        // Problem 1: a <Dialog> renders via a portal outside ref in the DOM, which used to make an
        // outer PopupContainer's useOnClickOutside close immediately on any click inside it.
        // Problem 2: ignoring every portal click unconditionally would break useOnClickOutside for a
        // popup nested inside a dialog, so only ignore portals which the ref itself isn't part of.
        const portal = target.closest('[data-aksel-portal]');

        if (portal !== null && !portal.contains(ref.current)) {
          return;
        }

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

      if (event.key === Keys.Escape) {
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
