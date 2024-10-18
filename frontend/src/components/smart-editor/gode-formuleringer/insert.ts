import type { RichTextEditor } from '@app/plate/types';
import { type Value, insertFragment } from '@udecode/plate-common';
import { focusEditor } from '@udecode/plate-common/react';

export const insertGodFormulering = (editor: RichTextEditor, content: Value) => {
  if (!isAvailable(editor)) {
    return;
  }

  insertFragment(editor, structuredClone(content), { voids: false });

  setTimeout(() => {
    focusEditor(editor);
  });
};

export const isAvailable = (editor: RichTextEditor): boolean => editor.selection !== null;
