import { EMPTY_CHAR_CODE } from '@app/functions/remove-empty-char-in-text';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { getPlaceholderEntry } from '@app/plate/plugins/placeholder/queries';
import type { PlaceholderElement } from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';
import type { PlateEditor } from '@udecode/plate-core/react';

const EMPTY_CHAR = String.fromCharCode(EMPTY_CHAR_CODE);

const placeholderIsEmpty = (placeholder: PlaceholderElement) => {
  const [firstChild] = placeholder.children;

  return placeholder.children.length === 1 && firstChild !== undefined && firstChild.text === EMPTY_CHAR;
};

export const handleDeleteBackwardFromInside = (editor: PlateEditor): boolean => {
  const placeholderEntry = getPlaceholderEntry(editor);

  const offset = editor.selection?.anchor.offset;

  // Normally we would check offset > 0, but remember that placeholders start with an empty char
  if (placeholderEntry === undefined || offset === undefined || offset > 1) {
    return false;
  }

  const [node, path] = placeholderEntry;

  if (placeholderIsEmpty(node)) {
    editor.tf.delete({ at: path });

    return true;
  }

  return false;
};

export const handleDeleteForwardFromInside = (editor: PlateEditor): boolean => {
  const placeholderEntry = getPlaceholderEntry(editor);

  if (editor.selection === null || placeholderEntry === undefined) {
    return false;
  }

  const [node, path] = placeholderEntry;

  const isEnd = editor.api.isEnd(editor.selection.focus, path);

  if (!isEnd) {
    return false;
  }

  if (placeholderIsEmpty(node)) {
    editor.tf.delete({ at: path });

    return true;
  }

  return false;
};

export const handleDeleteBackwardFromOutside = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const isStart = editor.api.isStart(editor.selection.focus, editor.selection.focus.path);

  if (!isStart) {
    return false;
  }

  const prevNode = editor.api.previous({ at: editor.selection.focus.path });

  if (prevNode === undefined) {
    return false;
  }

  const [node, path] = prevNode;

  if (!isOfElementType<PlaceholderElement>(node, ELEMENT_PLACEHOLDER)) {
    return false;
  }

  if (placeholderIsEmpty(node)) {
    editor.tf.delete({ at: path });

    return true;
  }

  const end = editor.api.end(path);
  editor.tf.setSelection({ focus: end, anchor: end });

  return false;
};

export const handleDeleteForwardFromOutside = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const isEnd = editor.api.isEnd(editor.selection.focus, editor.selection.focus.path);

  if (!isEnd) {
    return false;
  }

  const nextNode = editor.api.next({ at: editor.selection.focus.path });

  if (nextNode === undefined) {
    return false;
  }

  const [node, path] = nextNode;

  if (!isOfElementType<PlaceholderElement>(node, ELEMENT_PLACEHOLDER)) {
    return false;
  }

  if (placeholderIsEmpty(node)) {
    editor.tf.delete({ at: path });

    return true;
  }

  const start = editor.api.start(path);
  editor.tf.setSelection({ focus: start, anchor: start });

  return false;
};
