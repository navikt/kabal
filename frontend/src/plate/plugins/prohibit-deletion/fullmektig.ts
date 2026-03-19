import type { PlateEditor } from 'platejs/react';
import { ELEMENT_FULLMEKTIG, ELEMENT_PLACEHOLDER } from '@/plate/plugins/element-types';

export const handleDeleteBackwardInFullmektig = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const fullmektig = editor.api.node({ match: { type: ELEMENT_FULLMEKTIG } });

  if (fullmektig === undefined) {
    return false;
  }

  const placeholder = editor.api.node({ match: { type: ELEMENT_PLACEHOLDER } });

  if (placeholder === undefined) {
    return false;
  }

  return editor.api.isStart(editor.selection.focus, placeholder[1]);
};

export const handleDeleteForwardInFullmektig = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const fullmektig = editor.api.node({ match: { type: ELEMENT_FULLMEKTIG } });

  if (fullmektig === undefined) {
    return false;
  }

  const placeholder = editor.api.node({ match: { type: ELEMENT_PLACEHOLDER } });

  if (placeholder === undefined) {
    return false;
  }

  return editor.api.isEnd(editor.selection.focus, placeholder[1]);
};
