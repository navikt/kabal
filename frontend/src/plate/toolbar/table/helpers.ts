import type { RichTextEditor, TableCellElement, TableRowElement } from '@app/plate/types';
import { isOfElementType, isOfElementTypeFn } from '@app/plate/utils/queries';
import { BaseTableCellPlugin, BaseTableRowPlugin } from '@platejs/table';
import type { NodeEntry, TNode } from 'platejs';
import { Path } from 'slate';

const findPath = (editor: RichTextEditor, node: TNode | undefined = undefined): Path | undefined =>
  node === undefined ? undefined : findPath(editor, node);

// Cell helpers
export const getCurrentCell = (editor: RichTextEditor): NodeEntry<TableCellElement> | undefined =>
  editor.api.node({ match: isOfElementTypeFn(BaseTableCellPlugin.node.type) });

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
): NodeEntry<TableRowElement> | undefined => {
  if (currentCellPath === undefined) {
    return undefined;
  }

  const parenNodeEntry = editor.api.parent(currentCellPath);

  if (parenNodeEntry === undefined) {
    return undefined;
  }

  const [currentRow, currentRowPath] = parenNodeEntry;

  if (!isOfElementType<TableRowElement>(currentRow, BaseTableRowPlugin.node.type)) {
    return undefined;
  }

  return [currentRow, currentRowPath];
};

export const getNextRow = (
  editor: RichTextEditor,
  currentRowPath: Path | undefined = getCurrentRow(editor)?.[1],
): NodeEntry<TableRowElement> | undefined => {
  if (currentRowPath === undefined) {
    return undefined;
  }

  const nextRowPath = Path.next(currentRowPath);

  if (!editor.api.some({ at: nextRowPath })) {
    return undefined;
  }

  const targetRowEntry = editor.api.node({ at: nextRowPath });

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
): NodeEntry<TableRowElement> | undefined => {
  if (currentRowPath === undefined) {
    return undefined;
  }

  if (!Path.hasPrevious(currentRowPath)) {
    return undefined;
  }

  const nextRowPath = Path.previous(currentRowPath);

  if (!editor.api.some({ at: nextRowPath })) {
    return undefined;
  }

  const targetRowEntry = editor.api.node({ at: nextRowPath });

  if (targetRowEntry === undefined) {
    return undefined;
  }

  const [targetRow, targetRowPath] = targetRowEntry;

  if (!isOfElementType<TableRowElement>(targetRow, BaseTableRowPlugin.node.type)) {
    return undefined;
  }

  return [targetRow, targetRowPath];
};
