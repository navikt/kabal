import {
  PlateEditor,
  TElement,
  TPath,
  getNodeAncestors,
  insertNodes,
  insertText,
  isElement,
  removeNodes,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import { Path } from 'slate';
import { EMPTY_CHAR_CODE, removeEmptyCharInText } from '@app/functions/remove-empty-char-in-text';
import { ELEMENT_MALTEKST } from '@app/plate/plugins/element-types';
import {
  EditorDescendant,
  EditorValue,
  MaltekstElement,
  PlaceholderElement,
  RichText,
  RichTextEditor,
} from '@app/plate/types';
import { isNodeEmpty, isOfElementType } from '@app/plate/utils/queries';

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

export const insertEmptyChar = (editor: RichTextEditor, at: TPath) => {
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

const getMaltekstElement = (editor: PlateEditor<EditorValue>, path: Path | undefined): MaltekstElement | undefined => {
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
  editor: RichTextEditor,
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
export const lonePlaceholderInMaltekst = (
  editor: RichTextEditor,
  element: PlaceholderElement,
  path: Path | undefined,
) => {
  const maltekst = getMaltekstElement(editor, path);

  if (maltekst === undefined) {
    return false;
  }

  return containsLonePlaceholder(editor, element, maltekst);
};
