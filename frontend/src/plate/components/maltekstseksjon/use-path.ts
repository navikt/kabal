import type { MaltekstseksjonElement } from '@app/plate/types';
import type { PlateEditor } from 'platejs/react';
import { useEffect, useRef } from 'react';
import { Path } from 'slate';

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

    if (!Path.equals(previous.current, path)) {
      previous.current = path;
    }
  }, [path]);

  return previous.current;
};
