import { PlateEditor, findNodePath } from '@udecode/plate-common';
import { useEffect, useRef } from 'react';
import { Path } from 'slate';
import { EditorValue, MaltekstseksjonElement } from '@app/plate/types';

export const usePath = (editor: PlateEditor<EditorValue>, element: MaltekstseksjonElement) => {
  const path = findNodePath(editor, element);
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
