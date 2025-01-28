import { ELEMENT_FULLMEKTIG, ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { findNode, isEndPoint, isStartPoint } from '@udecode/plate-common';
import type { PlateEditor } from '@udecode/plate-core/react';

export const handleDeleteBackwardInFullmektig = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const fullmektig = findNode(editor, { match: { type: ELEMENT_FULLMEKTIG } });

  if (fullmektig === undefined) {
    return false;
  }

  const placeholder = findNode(editor, { match: { type: ELEMENT_PLACEHOLDER } });

  if (placeholder === undefined) {
    return false;
  }

  return isStartPoint(editor, editor.selection.focus, placeholder[1]);
};

export const handleDeleteForwardInFullmektig = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const fullmektig = findNode(editor, { match: { type: ELEMENT_FULLMEKTIG } });

  if (fullmektig === undefined) {
    return false;
  }

  const placeholder = findNode(editor, { match: { type: ELEMENT_PLACEHOLDER } });

  if (placeholder === undefined) {
    return false;
  }

  return isEndPoint(editor, editor.selection.focus, placeholder[1]);
};
