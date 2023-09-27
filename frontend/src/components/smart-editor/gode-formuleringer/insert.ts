import {
  findNode,
  focusEditor,
  insertFragment,
  isElementEmpty,
  isExpanded,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { EditorValue, ParagraphElement, RichTextEditor } from '@app/plate/types';

export const insertGodFormulering = (editor: RichTextEditor, content: EditorValue) => {
  if (!isAvailable(editor)) {
    return;
  }

  withoutSavingHistory(editor, () => {
    withoutNormalizing(editor, () => {
      insertFragment(editor, structuredClone(content), { voids: false });
    });
  });

  setTimeout(() => {
    focusEditor(editor);
  });
};

export const isAvailable = (editor: RichTextEditor): boolean => {
  if (editor.selection === null || isExpanded(editor.selection)) {
    return false;
  }

  const paragraph = findNode<ParagraphElement>(editor, { match: { type: ELEMENT_PARAGRAPH } });

  if (paragraph === undefined) {
    return false;
  }

  return isElementEmpty(editor, paragraph[0]);
};
