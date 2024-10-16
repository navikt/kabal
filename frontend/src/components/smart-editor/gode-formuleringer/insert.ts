import type { EditorValue, RichTextEditor } from '@app/plate/types';
import { focusEditor, insertFragment } from '@udecode/plate-common';

export const insertGodFormulering = (editor: RichTextEditor, content: EditorValue) => {
  if (!isAvailable(editor)) {
    return;
  }

  insertFragment(editor, structuredClone(content), { voids: false });

  setTimeout(() => {
    focusEditor(editor);
  });
};

export const isAvailable = (editor: RichTextEditor): boolean => editor.selection !== null;
