import { isEditableTextNode } from '@app/plate/functions/is-editable-text';
import { type Path, TextApi, type TText } from 'platejs';
import type { PlateEditor } from 'platejs/react';

export const selectPreviousTextNode = (editor: PlateEditor, currentPath: Path): boolean => {
  const previous = editor.api.previous<TText>({
    at: currentPath,
    mode: 'lowest',
    text: true,
    match: (n, p) => TextApi.isText(n) && isEditableTextNode(editor, p),
  });

  if (previous === undefined) {
    return false;
  }

  const [, previousPath] = previous;

  const previousEndPoint = editor.api.end(previousPath);

  if (previousEndPoint === undefined) {
    return false;
  }

  editor.tf.select(previousEndPoint);
  editor.tf.focus();

  return true;
};
