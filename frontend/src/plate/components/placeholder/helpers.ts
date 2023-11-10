import {
  TPath,
  insertNodes,
  insertText,
  removeNodes,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import { Path } from 'slate';
import { removeEmptyCharInText } from '@app/functions/remove-empty-char-in-text';
import { PlaceholderElement, RichText, RichTextEditor } from '@app/plate/types';

const EMPTY_CHAR_CODE = 8203;
const EMPTY_CHAR = String.fromCharCode(EMPTY_CHAR_CODE); // \u200b

export const cleanText = (editor: RichTextEditor, element: PlaceholderElement, path: TPath, at: TPath) => {
  const _cleanText: RichText[] = element.children.map((c) => ({ ...c, text: removeEmptyCharInText(c.text) }));

  withoutSavingHistory(editor, () => {
    withoutNormalizing(editor, () => {
      removeNodes(editor, {
        at: path,
        match: (n) => n !== element,
      });
      insertNodes<RichText>(editor, _cleanText, { at, select: true });
    });
  });
};

export const ensureOnlyOneEmptyChar = (editor: RichTextEditor, element: PlaceholderElement, path: TPath, at: TPath) => {
  withoutSavingHistory(editor, () => {
    withoutNormalizing(editor, () => {
      removeNodes(editor, { at: path, match: (n) => n !== element });
      insertNodes<RichText>(editor, { text: EMPTY_CHAR }, { at });
    });
  });
};

export const insertEmptyChar = (editor: RichTextEditor, path: TPath, at: TPath) => {
  withoutSavingHistory(editor, () => {
    withoutNormalizing(editor, () => {
      insertText(editor, EMPTY_CHAR, { at });
    });
  });
};

export const getHasNoVisibleText = (text: string): boolean => {
  if (hasZeroChars(text)) {
    return true;
  }

  for (const char of text) {
    if (char.charCodeAt(0) !== EMPTY_CHAR_CODE) {
      return false;
    }
  }

  return true;
};

export const hasZeroChars = (text: string): boolean => text.length === 0;

export const containsEmptyChar = (text: string): boolean => {
  for (const char of text) {
    if (char.charCodeAt(0) === EMPTY_CHAR_CODE) {
      return true;
    }
  }

  return false;
};

export const containsMultipleEmptyCharAndNoText = (text: string): boolean => {
  if (hasZeroChars(text)) {
    return false;
  }

  let emptyCharCount = 0;

  for (const ch of text) {
    if (ch.charCodeAt(0) === EMPTY_CHAR_CODE) {
      emptyCharCount++;
    } else {
      return false;
    }
  }

  return emptyCharCount > 1;
};

export const getIsFocused = (editor: RichTextEditor, path: TPath): boolean => {
  if (editor.selection === null) {
    return false;
  }

  return Path.isParent(path, editor.selection.focus.path);
};
