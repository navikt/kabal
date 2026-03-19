import type { Value } from 'platejs';
import type { RichTextEditor } from '@/plate/types';

export const insertGodFormulering = (editor: RichTextEditor, content: Value) => {
  if (editor.selection === null) {
    return;
  }

  editor.tf.insertFragment(structuredClone(content), { voids: false });

  setTimeout(() => {
    editor.tf.focus();
  });
};
