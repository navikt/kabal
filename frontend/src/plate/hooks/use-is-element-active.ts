import { type TElement, isBlock, isExpanded, someNode } from '@udecode/plate-common';
import { useMyPlateEditorState } from '../types';

export const useIsElementActive = (element: string) => {
  const editor = useMyPlateEditorState();

  if (editor.selection === null || isExpanded(editor.selection)) {
    return false;
  }

  return someNode<TElement>(editor, {
    match: (n) => isBlock(editor, n) && n.type === element,
    mode: 'lowest',
  });
};
