import {
  ELEMENT_PLACEHOLDER,
  ELEMENT_REGELVERK_CONTAINER,
  UNDELETABLE_BUT_EDITABLE,
} from '@app/plate/plugins/element-types';
import { isInRegelverk, isInUnchangeableElement, isUndeletable } from '@app/plate/plugins/prohibit-deletion/helpers';
import type { PlaceholderElement } from '@app/plate/types';
import { isInList } from '@app/plate/utils/queries';
import { ElementApi } from '@udecode/plate';
import type { PlateEditor } from '@udecode/plate-core/react';
import { Path, type TextDirection, type TextUnit, isEditor } from 'slate';

const deleteCurrentNode = (editor: PlateEditor): void => {
  const currentEntry = editor.api.node({ match: (n) => !isEditor(n) });

  if (isUndeletable(editor, currentEntry)) {
    return;
  }

  if (currentEntry === undefined) {
    return;
  }

  const [node] = currentEntry;

  if (!ElementApi.isElement(node)) {
    return;
  }

  if (editor.api.isEmpty(node)) {
    editor.tf.removeNodes();
  }
};

export const handleDeleteBackwardIntoUnchangeable = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const prevSibling = Path.hasPrevious(editor.selection.focus.path)
    ? editor.api.node({ at: Path.previous(editor.selection.focus.path), mode: 'lowest', voids: true })
    : undefined;

  // Prohibit deletion for inline undeletables
  if (editor.selection.focus.offset === 0 && isUndeletable(editor, prevSibling)) {
    deleteCurrentNode(editor);

    return true;
  }

  if (!editor.api.isAt({ start: true })) {
    return false;
  }

  // Normal handling for lists (will be converted to paragraph)
  if (isInList(editor)) {
    return false;
  }

  const redigerbarMaltekstOrRegelverk = editor.api.node({
    match: (n) => ElementApi.isElement(n) && UNDELETABLE_BUT_EDITABLE.includes(n.type),
  });

  if (redigerbarMaltekstOrRegelverk !== undefined) {
    const [, path] = redigerbarMaltekstOrRegelverk;

    // Normal handling if focus is in redigerbar maltekst / regelverk container, but not at the start
    if (!editor.api.isStart(editor.selection.focus, path)) {
      return false;
    }
  }

  // If previous node is undeletable, remove self (if deletable)
  if (isUndeletable(editor, editor.api.previous())) {
    deleteCurrentNode(editor);

    return true;
  }

  return false;
};

export const handleDeleteForwardIntoUnchangeable = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const nextSibling = editor.api.node({ at: Path.next(editor.selection.focus.path), mode: 'lowest', voids: true });
  const isEnd = editor.api.isEnd(editor.selection.focus, editor.selection.focus.path);

  // Prohibit deletion for inline undeletables
  if (isEnd && isUndeletable(editor, nextSibling)) {
    deleteCurrentNode(editor);

    return true;
  }

  if (!editor.api.isAt({ end: true })) {
    return false;
  }

  const redigerbarMaltekstOrRegelverk = editor.api.node({
    match: (n) => ElementApi.isElement(n) && UNDELETABLE_BUT_EDITABLE.includes(n.type),
  });

  if (redigerbarMaltekstOrRegelverk !== undefined) {
    const [, path] = redigerbarMaltekstOrRegelverk;

    // Normal handling if focus is in redigerbar maltekst / regelverk container, but not at the end
    if (!editor.api.isEnd(editor.selection.focus, path)) {
      return false;
    }
  }

  // Remove self if next node is undeletable
  if (isUndeletable(editor, editor.api.next())) {
    deleteCurrentNode(editor);

    return true;
  }

  return false;
};

const handleDeleteInside = (
  editor: PlateEditor,
  type: string,
  direction: TextDirection,
  unit: TextUnit | undefined,
) => {
  if (editor.selection === null) {
    return true;
  }

  const entry = editor.api.node({ match: { type }, at: editor.selection });

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

    return editor.api.isStart(editor.selection.focus, entry[1]);
  }

  return editor.api.isEnd(editor.selection.focus, entry[1]);
};

export const handleDeleteInsideUnchangeable = (
  editor: PlateEditor,
  direction: TextDirection,
  unit: TextUnit | undefined,
): boolean => {
  if (isInRegelverk(editor)) {
    return handleDeleteInside(editor, ELEMENT_REGELVERK_CONTAINER, direction, unit);
  }

  if (isInUnchangeableElement(editor)) {
    return handleDeleteInside(editor, ELEMENT_PLACEHOLDER, direction, unit);
  }

  return false;
};

export const handleDeleteInsidePlaceholder = (editor: PlateEditor, backward: boolean) => {
  if (editor.selection === null) {
    return false;
  }

  const entry = editor.api.node<PlaceholderElement>({
    match: (n) => ElementApi.isElement(n) && n.type === ELEMENT_PLACEHOLDER,
    at: editor.selection,
  });

  if (entry === undefined) {
    return false;
  }

  const [{ deletable }, path] = entry;

  if (backward) {
    const isStart = editor.api.isStart(editor.selection.focus, path);

    return isStart && deletable === false;
  }

  const isEnd = editor.api.isEnd(editor.selection.focus, path);

  return isEnd && deletable === false;
};
