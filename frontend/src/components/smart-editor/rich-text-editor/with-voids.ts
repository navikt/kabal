import { Editor, Location } from 'slate';
import { isVoid as isVoidElement } from '../editor-types';

export const withEditableVoids = (editor: Editor) => {
  const { isVoid, deleteFragment, deleteBackward, deleteForward } = editor;

  editor.isVoid = (element) => (isVoidElement(element) ? true : isVoid(element));

  editor.deleteBackward = (unit) => {
    if (editor.selection === null) {
      return;
    }

    const before = Editor.before(editor, editor.selection, {
      unit,
      voids: true,
    });

    if (containsVoid(editor, before)) {
      return;
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    if (editor.selection === null) {
      return;
    }

    const after = Editor.after(editor, editor.selection, {
      unit,
      voids: true,
    });

    if (containsVoid(editor, after)) {
      return;
    }

    deleteForward(unit);
  };

  editor.deleteFragment = (direction) => {
    if (containsVoid(editor, editor.selection)) {
      return;
    }

    deleteFragment(direction);
  };

  return editor;
};

const containsVoid = (editor: Editor, at: Location | null | undefined) => {
  if (at === null || typeof at === 'undefined') {
    return true;
  }

  const [nodeEntry] = Editor.nodes(editor, {
    at,
    voids: true,
    match: (n) => Editor.isVoid(editor, n),
  });

  return typeof nodeEntry !== 'undefined';
};
