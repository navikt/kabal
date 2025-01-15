import { NodeApi, type TText, TextApi } from '@udecode/plate';
import type { PlateEditor } from '@udecode/plate-core/react';
import type { KeyboardEvent } from 'react';
import { ELEMENT_PLACEHOLDER } from '../element-types';

export const handleArrows = (editor: PlateEditor, e: KeyboardEvent) => {
  const isArrowDown = e.key === 'ArrowDown';

  if (isArrowDown || e.key === 'ArrowUp') {
    const current = editor.api.node({ match: { type: ELEMENT_PLACEHOLDER } });

    if (current === undefined) {
      return true;
    }

    const [currentNode] = current;
    const getNextOrPreviousNode = isArrowDown ? editor.api.next : editor.api.previous;
    const textNode = getNextOrPreviousNode<TText>({
      match: (n, p) => TextApi.isText(n) && NodeApi.parent(editor, p) !== currentNode,
    });

    if (textNode === undefined) {
      return true;
    }

    const [node, path] = textNode;
    const offset = isArrowDown ? 0 : node.text.length;

    e.preventDefault();

    editor.tf.setSelection({ anchor: { path, offset }, focus: { path, offset } });

    return true;
  }

  return false;
};
