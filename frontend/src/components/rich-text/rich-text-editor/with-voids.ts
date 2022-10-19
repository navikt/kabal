import { Editor } from 'slate';
import { containsUndeletableVoid, containsVoid } from '../functions/contains-void';
import { isPlaceholderSelectedInMaltekstWithOverlap } from '../functions/insert-placeholder';
import {
  isAtEndOfPlaceholder,
  isInMaltekst,
  isInMaltekstAndNotPlaceholder,
  isInPlaceholder,
} from '../functions/maltekst';
import { ContentTypeEnum, DeletableVoidElementsEnum } from '../types/editor-enums';
import { isVoid as isVoidElement } from '../types/editor-type-guards';

const INLINE_TYPES = [DeletableVoidElementsEnum.FLETTEFELT, ContentTypeEnum.PLACEHOLDER];

export const withEditableVoids = (editor: Editor) => {
  const {
    deleteBackward,
    deleteForward,
    deleteFragment,
    insertBreak,
    insertData,
    insertSoftBreak,
    insertText,
    isInline,
    isVoid,
  } = editor;

  editor.isVoid = (element) => (isVoidElement(element) ? true : isVoid(element));

  editor.isInline = (e) => (INLINE_TYPES.some((t) => t === e.type) ? true : isInline(e));

  editor.deleteBackward = (unit) => {
    if (editor.selection === null) {
      return;
    }

    if (editor.selection.focus.offset === 0 && isInPlaceholder(editor)) {
      return;
    }

    if (containsUndeletableVoid(editor, editor.selection) || isInMaltekstAndNotPlaceholder(editor)) {
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

    if (isAtEndOfPlaceholder(editor)) {
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
    if (containsUndeletableVoid(editor, editor.selection) || isInMaltekstAndNotPlaceholder(editor)) {
      return;
    }

    deleteFragment(direction);
  };

  editor.insertBreak = () => {
    if (containsVoid(editor, editor.selection) || isInMaltekst(editor)) {
      return;
    }

    insertBreak();
  };

  editor.insertData = (node) => {
    if (isInPlaceholder(editor)) {
      return insertText(node.getData('text/plain').replaceAll('\n', ' '));
    }

    if (isInMaltekst(editor)) {
      return;
    }

    return insertData(node);
  };

  editor.insertText = (text: string) => {
    if (isPlaceholderSelectedInMaltekstWithOverlap(editor)) {
      return;
    }

    return insertText(text);
  };

  editor.insertSoftBreak = () => {
    if (isInMaltekst(editor)) {
      return;
    }

    return insertSoftBreak();
  };

  return editor;
};
