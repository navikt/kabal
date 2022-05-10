import { Editor } from 'slate';
import { containsUndeletableVoid, containsVoid } from '../functions/contains-void';
import { DeletableVoidElementsEnum } from '../types/editor-enums';
import { isVoid as isVoidElement } from '../types/editor-type-guards';

export const withEditableVoids = (editor: Editor) => {
  const { isVoid, deleteFragment, deleteBackward, deleteForward, insertBreak, isInline } = editor;

  editor.isVoid = (element) => (isVoidElement(element) ? true : isVoid(element));

  editor.isInline = (e) => (e.type === DeletableVoidElementsEnum.FLETTEFELT ? true : isInline(e));

  editor.deleteBackward = (unit) => {
    if (editor.selection === null) {
      return;
    }

    if (containsUndeletableVoid(editor, editor.selection)) {
      return;
    }

    const before = Editor.before(editor, editor.selection, {
      unit,
      voids: true,
    });

    if (containsUndeletableVoid(editor, before)) {
      return;
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    if (editor.selection === null) {
      return;
    }

    if (containsUndeletableVoid(editor, editor.selection)) {
      return;
    }

    const after = Editor.after(editor, editor.selection, {
      unit,
      voids: true,
    });

    if (containsUndeletableVoid(editor, after)) {
      return;
    }

    deleteForward(unit);
  };

  editor.deleteFragment = (direction) => {
    if (containsUndeletableVoid(editor, editor.selection)) {
      return;
    }

    deleteFragment(direction);
  };

  editor.insertBreak = () => {
    if (containsVoid(editor, editor.selection)) {
      return;
    }

    insertBreak();
  };

  return editor;
};
