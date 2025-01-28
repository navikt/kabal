import { EMPTY_CHAR_CODE, removeEmptyCharInText } from '@app/functions/remove-empty-char-in-text';
import { ELEMENT_MALTEKST } from '@app/plate/plugins/element-types';
import type { EditorDescendant, FormattedText, MaltekstElement, PlaceholderElement } from '@app/plate/types';
import { isNodeEmpty, isOfElementType } from '@app/plate/utils/queries';
import {
  type TElement,
  type TPath,
  getNodeAncestors,
  insertNodes,
  insertText,
  isElement,
  removeNodes,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import type { PlateEditor } from '@udecode/plate-core/react';
import { Path } from 'slate';

const EMPTY_CHAR = String.fromCharCode(EMPTY_CHAR_CODE); // \u200b

export const cleanText = (editor: PlateEditor, element: PlaceholderElement, path: TPath, at: TPath) => {
  const cleanedText: FormattedText[] = element.children.map((c) => ({ ...c, text: removeEmptyCharInText(c.text) }));

  withoutSavingHistory(editor, () => {
    withoutNormalizing(editor, () => {
      removeNodes(editor, {
        at: path,
        match: (n) => n !== element,
      });
      insertNodes<FormattedText>(editor, cleanedText, { at, select: true });
    });
  });
};

export const ensureOnlyOneEmptyChar = (editor: PlateEditor, element: PlaceholderElement, path: TPath, at: TPath) => {
  withoutSavingHistory(editor, () => {
    withoutNormalizing(editor, () => {
      removeNodes(editor, { at: path, match: (n) => n !== element });
      insertNodes<FormattedText>(editor, { text: EMPTY_CHAR }, { at });
    });
  });
};

export const insertEmptyChar = (editor: PlateEditor, at: TPath) => {
  withoutSavingHistory(editor, () => {
    withoutNormalizing(editor, () => {
      insertText(editor, EMPTY_CHAR, { at });
    });
  });
};

export const getHasNoVisibleText = (text: string): boolean => {
  if (getHasZeroChars(text)) {
    return true;
  }

  for (const char of text) {
    if (char.charCodeAt(0) !== EMPTY_CHAR_CODE) {
      return false;
    }
  }

  return true;
};

export const getHasZeroChars = (text: string): boolean => text.length === 0;

export const getContainsEmptyChar = (text: string): boolean => {
  for (const char of text) {
    if (char.charCodeAt(0) === EMPTY_CHAR_CODE) {
      return true;
    }
  }

  return false;
};

export const containsMultipleEmptyCharAndNoText = (text: string): boolean => {
  if (getHasZeroChars(text)) {
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

export const getIsFocused = (editor: PlateEditor, path: TPath | undefined): boolean => {
  if (editor.selection === null || path === undefined) {
    return false;
  }

  return Path.isParent(path, editor.selection.focus.path);
};

const getMaltekstElement = (editor: PlateEditor, path: Path | undefined): MaltekstElement | undefined => {
  if (path === undefined) {
    return undefined;
  }

  const ancestors = getNodeAncestors(editor, path);

  for (const [node] of ancestors) {
    if (isOfElementType<MaltekstElement>(node, ELEMENT_MALTEKST)) {
      return node;
    }
  }

  return undefined;
};

const containsLonePlaceholder = (
  editor: PlateEditor,
  element: PlaceholderElement,
  child: EditorDescendant | TElement,
): boolean => {
  if (child === element) {
    return true;
  }

  if (!isElement(child)) {
    return false;
  }

  const filtered = child.children.filter((c) => !isNodeEmpty(c));

  if (filtered.length !== 1) {
    return false;
  }

  const [grandChild] = filtered;

  if (grandChild === undefined) {
    return false;
  }

  return containsLonePlaceholder(editor, element, grandChild);
};

/**
 * Checks if placeholder is a descendant of a maltekst element, and that there are no non-empty siblings in the tree
 *
 * I.e will return true if maltekst has one h1 child, and that h1 child has one placeholder child
 *
 */
export const lonePlaceholderInMaltekst = (editor: PlateEditor, element: PlaceholderElement, path: Path | undefined) => {
  const maltekst = getMaltekstElement(editor, path);

  if (maltekst === undefined) {
    return false;
  }

  return containsLonePlaceholder(editor, element, maltekst);
};
