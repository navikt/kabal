import { focusEditor, insertFragment, withoutNormalizing, withoutSavingHistory } from '@udecode/plate-common';
import { EditorValue, RichTextEditor } from '@app/plate/types';

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

export const isAvailable = (editor: RichTextEditor): boolean => editor.selection !== null;
