import {
  type PlateEditor,
  type TText,
  findNode,
  getNextNode,
  getNodeParent,
  getPreviousNode,
  isText,
  setSelection as plateSetSelection,
} from '@udecode/plate-common';
import type { KeyboardEvent } from 'react';
import { ELEMENT_PLACEHOLDER } from '../element-types';

export const handleArrows = (editor: PlateEditor, e: KeyboardEvent) => {
  const isArrowDown = e.key === 'ArrowDown';

  if (isArrowDown || e.key === 'ArrowUp') {
    const current = findNode(editor, { match: { type: ELEMENT_PLACEHOLDER } });

    if (current === undefined) {
      return true;
    }

    const [currentNode] = current;
    const getNextOrPreviousNode = isArrowDown ? getNextNode : getPreviousNode;
    const textNode = getNextOrPreviousNode<TText>(editor, {
      match: (n, p) => isText(n) && getNodeParent(editor, p) !== currentNode,
    });

    if (textNode === undefined) {
      return true;
    }

    const [node, path] = textNode;
    const offset = isArrowDown ? 0 : node.text.length;

    e.preventDefault();

    plateSetSelection(editor, { anchor: { path, offset }, focus: { path, offset } });

    return true;
  }

  return false;
};
