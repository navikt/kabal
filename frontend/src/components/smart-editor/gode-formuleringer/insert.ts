import type { RichTextEditor } from '@app/plate/types';
import type { Value } from '@udecode/plate';

export const insertGodFormulering = (editor: RichTextEditor, content: Value) => {
  if (editor.selection === null) {
    return;
  }

  editor.tf.insertFragment(structuredClone(content), { voids: false });

  setTimeout(() => {
    editor.tf.focus();
  });
};
