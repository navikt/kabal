import { type Path, PathApi } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { useEffect, useRef } from 'react';
import type { MaltekstseksjonElement } from '@/plate/types';

export const usePath = (editor: PlateEditor, element: MaltekstseksjonElement) => {
  const path = editor.api.findPath(element);
  const previous = useRef<Path | undefined>(path);

  useEffect(() => {
    if (path === previous.current) {
      return;
    }

    if (previous.current === undefined) {
      if (path === undefined) {
        return;
      }

      previous.current = path;

      return;
    }

    if (path === undefined) {
      if (previous.current === undefined) {
        return;
      }

      previous.current = undefined;

      return;
    }

    if (!PathApi.equals(previous.current, path)) {
      previous.current = path;
    }
  }, [path]);

  return previous.current;
};
