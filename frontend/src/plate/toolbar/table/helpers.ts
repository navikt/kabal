import type { RichTextEditor, TableCellElement, TableRowElement } from '@app/plate/types';
import { isOfElementType, isOfElementTypeFn } from '@app/plate/utils/queries';
import { type TNode, type TNodeEntry, findNode, getParentNode, someNode } from '@udecode/plate-common';
import { BaseTableCellPlugin, BaseTableRowPlugin } from '@udecode/plate-table';
import { findNodePath } from '@udecode/slate-react';
import { Path } from 'slate';

const findPath = (editor: RichTextEditor, node: TNode | undefined = undefined): Path | undefined =>
  node === undefined ? undefined : findNodePath(editor, node);

// Cell helpers
export const getCurrentCell = (editor: RichTextEditor): TNodeEntry<TableCellElement> | undefined =>
  findNode(editor, { match: isOfElementTypeFn(BaseTableCellPlugin.node.type) });

export const getCellColumnOffset = (
  editor: RichTextEditor,
  currentCell: TableCellElement | undefined = getCurrentCell(editor)?.[0],
  currentRow: TableRowElement | undefined = getCurrentRow(editor, currentCell)?.[0],
): number => {
  if (currentCell === undefined || currentRow === undefined) {
    return 0;
  }
  const index = currentRow.children.indexOf(currentCell);
  const columns = currentRow.children.slice(0, index).reduce((acc, c) => acc + (c.colSpan ?? 1), 0);

  return columns;
};

// Row helpers
export const getCurrentRow = (
  editor: RichTextEditor,
  currentCell: TableCellElement | undefined = getCurrentCell(editor)?.[0],
  currentCellPath = findPath(editor, currentCell),
): TNodeEntry<TableRowElement> | undefined => {
  if (currentCellPath === undefined) {
    return undefined;
  }

  const parentNodeEntry = getParentNode(editor, currentCellPath);

  if (parentNodeEntry === undefined) {
    return undefined;
  }

  const [currentRow, currentRowPath] = parentNodeEntry;

  if (!isOfElementType<TableRowElement>(currentRow, BaseTableRowPlugin.node.type)) {
    return undefined;
  }

  return [currentRow, currentRowPath];
};

export const getNextRow = (
  editor: RichTextEditor,
  currentRowPath: Path | undefined = getCurrentRow(editor)?.[1],
): TNodeEntry<TableRowElement> | undefined => {
  if (currentRowPath === undefined) {
    return undefined;
  }

  const nextRowPath = Path.next(currentRowPath);

  if (!someNode(editor, { at: nextRowPath })) {
    return undefined;
  }

  const targetRowEntry = findNode(editor, { at: nextRowPath });

  if (targetRowEntry === undefined) {
    return undefined;
  }

  const [targetRow, targetRowPath] = targetRowEntry;

  if (!isOfElementType<TableRowElement>(targetRow, BaseTableRowPlugin.node.type)) {
    return undefined;
  }

  return [targetRow, targetRowPath];
};

export const getPreviousRow = (
  editor: RichTextEditor,
  currentRowPath: Path | undefined = getCurrentRow(editor)?.[1],
): TNodeEntry<TableRowElement> | undefined => {
  if (currentRowPath === undefined) {
    return undefined;
  }

  if (!Path.hasPrevious(currentRowPath)) {
    return undefined;
  }

  const nextRowPath = Path.previous(currentRowPath);

  if (!someNode(editor, { at: nextRowPath })) {
    return undefined;
  }

  const targetRowEntry = findNode(editor, { at: nextRowPath });

  if (targetRowEntry === undefined) {
    return undefined;
  }

  const [targetRow, targetRowPath] = targetRowEntry;

  if (!isOfElementType<TableRowElement>(targetRow, BaseTableRowPlugin.node.type)) {
    return undefined;
  }

  return [targetRow, targetRowPath];
};
