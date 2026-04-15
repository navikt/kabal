import { BaseListItemPlugin } from '@platejs/list-classic';
import { type At, BaseParagraphPlugin, ElementApi, NodeApi, type Path, PathApi } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { containsCaret } from '@/plate/plugins/cleanup/contains-caret';
import { UNDELETABLE_BUT_EDITABLE } from '@/plate/plugins/element-types';
import type { ListItemElement, ParagraphElement } from '@/plate/types';
import { isHeading, isList, isOfElementType, isPathInTable, isPathUnchangeable } from '@/plate/utils/queries';

export const removeEmptyElements = (editor: PlateEditor, at: At = [], caretPath: Path | null = null): void => {
  editor.tf.removeNodes({
    at,
    block: true,
    text: false,
    voids: false,
    // Only remove the outermost empty match. Without this, removeNodes removes inner items first,
    // which changes the tree and prevents the parent list from being removed in the same pass.
    mode: 'highest',
    match: (n, p) => {
      if (containsCaret(p, caretPath)) {
        return false;
      }

      // Skip elements inside unchangeable ancestors.
      if (isPathUnchangeable(editor, p)) {
        return false;
      }

      if (isList(n)) {
        // If the list is the only child of an undeletable parent, normalization will restore a valid child after removal.
        return n.children.every((item) => isEmptyListItem(editor, item));
      }

      if (isOfElementType<ListItemElement>(n, BaseListItemPlugin.key)) {
        return isEmptyListItem(editor, n);
      }

      if (isHeading(n)) {
        return editor.api.isEmpty(n) && !shouldPreserveForUndeletableParent(editor, p);
      }

      if (isOfElementType<ParagraphElement>(n, BaseParagraphPlugin.key) && !isPathInTable(editor, p)) {
        return editor.api.isEmpty(n) && !shouldPreserveForUndeletableParent(editor, p);
      }

      return false;
    },
  });
};

/** A list item is empty if its content is empty and any nested sublist is also fully empty. */
const isEmptyListItem = (editor: PlateEditor, item: ListItemElement): boolean => {
  const [lic, ...rest] = item.children;

  return editor.api.isEmpty(lic) && rest.every((child) => isList(child) && isEmptyList(editor, child));
};

const isEmptyList = (editor: PlateEditor, list: { children: ListItemElement[] }): boolean =>
  list.children.every((item) => isEmptyListItem(editor, item));

/**
 * If the parent is redigerbar-maltekst or regelverk-container and ALL its children are empty,
 * preserve the first child to avoid leaving the parent with no block children.
 * removeNodes evaluates all matches before removing, so children.length reflects the original state.
 *
 * This only applies to paragraphs and headings. Lists are not handled here - if a fully-empty list
 * is the only child, normalization will restore a valid child after removal.
 */
const shouldPreserveForUndeletableParent = (editor: PlateEditor, path: Path): boolean => {
  // Top-level elements have no parent element to preserve.
  if (path.length < 2) {
    return false;
  }

  const parent = NodeApi.parent(editor, path);

  if (!ElementApi.isElement(parent) || !UNDELETABLE_BUT_EDITABLE.includes(parent.type)) {
    return false;
  }

  // If it is the first child.
  if (PathApi.hasPrevious(path)) {
    return false;
  }

  return parent.children.every((child) => editor.api.isEmpty(child));
};
