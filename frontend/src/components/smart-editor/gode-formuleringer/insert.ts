import type { RichTextEditor } from '@app/plate/types';
import type { Value } from '@udecode/plate';

export const insertGodFormulering = (editor: RichTextEditor, content: Value) => {
  if (!isAvailable(editor)) {
    return;
  }

  editor.tf.insertFragment(structuredClone(content), { voids: false });

  setTimeout(() => {
    editor.tf.focus();
  });
};

export const isAvailable = (editor: RichTextEditor): boolean => editor.selection !== null;
