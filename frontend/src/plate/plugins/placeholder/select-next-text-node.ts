import { isEditableTextNode } from '@app/plate/functions/is-editable-text';
import { type Path, TextApi, type TText } from 'platejs';
import type { PlateEditor } from 'platejs/react';

export const selectNextTextNode = (editor: PlateEditor, currentPath: Path): boolean => {
  const next = editor.api.next<TText>({
    at: currentPath,
    mode: 'lowest',
    text: true,
    match: (n, p) => TextApi.isText(n) && isEditableTextNode(editor, p),
  });

  if (next === undefined) {
    return false;
  }

  const [, nextPath] = next;

  const nextStartPoint = editor.api.start(nextPath);

  if (nextStartPoint === undefined) {
    return false;
  }

  editor.tf.select(nextStartPoint);
  editor.tf.focus();

  return true;
};
