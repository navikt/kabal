import {
  ELEMENT_PLACEHOLDER,
  ELEMENT_REGELVERK_CONTAINER,
  UNDELETABLE_BUT_REDIGERBAR,
} from '@app/plate/plugins/element-types';
import { isInRegelverk, isInUnchangeableElement, isUndeletable } from '@app/plate/plugins/prohibit-deletion/helpers';
import type { RichTextEditor } from '@app/plate/types';
import { isInList } from '@app/plate/utils/queries';
import {
  findNode,
  getNextNode,
  getPreviousNode,
  isEditor,
  isElement,
  isElementEmpty,
  isEndPoint,
  isSelectionAtBlockEnd,
  isSelectionAtBlockStart,
  isStartPoint,
  removeNodes,
} from '@udecode/plate-common';
import { Path, type TextDirection, type TextUnit } from 'slate';

const deleteCurrentNode = (editor: RichTextEditor): void => {
  const currentNode = findNode(editor, { match: (n) => !isEditor(n) });

  if (isUndeletable(editor, currentNode)) {
    return;
  }

  if (currentNode === undefined) {
    return;
  }

  const [node] = currentNode;

  if (!isElement(node)) {
    return;
  }

  if (isElementEmpty(editor, node)) {
    removeNodes(editor);
  }
};

export const handleDeleteBackwardIntoUnchangeable = (editor: RichTextEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const prevSibling = Path.hasPrevious(editor.selection.focus.path)
    ? findNode(editor, { at: Path.previous(editor.selection.focus.path), mode: 'lowest', voids: true })
    : undefined;

  // Prohibit deletion for inline undeletables
  if (editor.selection.focus.offset === 0 && isUndeletable(editor, prevSibling)) {
    deleteCurrentNode(editor);

    return true;
  }

  if (!isSelectionAtBlockStart(editor)) {
    return false;
  }

  // Normal handling for lists (will be converted to paragraph)
  if (isInList(editor)) {
    return false;
  }

  const redigerbarMaltekstOrRegelverk = findNode(editor, {
    match: (n) => isElement(n) && UNDELETABLE_BUT_REDIGERBAR.includes(n.type),
  });

  if (redigerbarMaltekstOrRegelverk !== undefined) {
    const [, path] = redigerbarMaltekstOrRegelverk;

    // Normal handling if focus is in redigerbar maltekst / regelverk container, but not at the start
    if (!isStartPoint(editor, editor.selection.focus, path)) {
      return false;
    }
  }

  // If previous node is undeletable, remove self (if deletable)
  if (isUndeletable(editor, getPreviousNode(editor))) {
    deleteCurrentNode(editor);

    return true;
  }

  return false;
};

export const handleDeleteForwardIntoUnchangeable = (editor: RichTextEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const nextSibling = findNode(editor, { at: Path.next(editor.selection.focus.path), mode: 'lowest', voids: true });
  const isEnd = isEndPoint(editor, editor.selection.focus, editor.selection.focus.path);

  // Prohibit deletion for inline undeletables
  if (isEnd && isUndeletable(editor, nextSibling)) {
    deleteCurrentNode(editor);

    return true;
  }

  if (!isSelectionAtBlockEnd(editor)) {
    return false;
  }

  const redigerbarMaltekstOrRegelverk = findNode(editor, {
    match: (n) => isElement(n) && UNDELETABLE_BUT_REDIGERBAR.includes(n.type),
  });

  if (redigerbarMaltekstOrRegelverk !== undefined) {
    const [, path] = redigerbarMaltekstOrRegelverk;

    // Normal handling if focus is in redigerbar maltekst / regelverk container, but not at the end
    if (!isEndPoint(editor, editor.selection.focus, path)) {
      return false;
    }
  }

  // Remove self if next node is undeletable
  if (isUndeletable(editor, getNextNode(editor))) {
    deleteCurrentNode(editor);

    return true;
  }

  return false;
};

const handleDeleteInside = (editor: RichTextEditor, type: string, direction: TextDirection, unit: TextUnit) => {
  if (editor.selection === null) {
    return true;
  }

  const entry = findNode(editor, { match: { type }, at: editor.selection });

  if (entry === undefined) {
    return true;
  }

  if (unit === 'line' || unit === 'block') {
    return true;
  }

  if (direction === 'backward') {
    if (isInList(editor)) {
      return false;
    }

    return isStartPoint(editor, editor.selection.focus, entry[1]);
  }

  return isEndPoint(editor, editor.selection.focus, entry[1]);
};

export const handleDeleteInsideUnchangeable = (
  editor: RichTextEditor,
  direction: TextDirection,
  unit: TextUnit,
): boolean => {
  if (isInRegelverk(editor)) {
    return handleDeleteInside(editor, ELEMENT_REGELVERK_CONTAINER, direction, unit);
  }

  if (isInUnchangeableElement(editor)) {
    return handleDeleteInside(editor, ELEMENT_PLACEHOLDER, direction, unit);
  }

  return false;
};
