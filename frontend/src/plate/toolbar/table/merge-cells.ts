import { getCurrentRow } from '@app/plate/toolbar/table/helpers';
import type { ParagraphElement, RichTextEditor, TableCellElement, TableRowElement } from '@app/plate/types';
import { isOfElementType, isOfElementTypeFn } from '@app/plate/utils/queries';
import {
  BaseParagraphPlugin,
  getNextNode,
  isElementEmpty,
  mergeNodes,
  setNodes,
  withoutNormalizing,
} from '@udecode/plate-common';
import { BaseTableCellPlugin, BaseTableRowPlugin } from '@udecode/plate-table';
import { findNodePath } from '@udecode/slate-react';

export const mergeCells = (
  editor: RichTextEditor,
  cellNode: TableCellElement,
  cellPath = findNodePath(editor, cellNode),
) => {
  const rowEntry = getCurrentRow(editor, cellNode, cellPath);

  if (rowEntry === undefined) {
    return cellPath;
  }

  const [row] = rowEntry;

  if (!isOfElementType<TableRowElement>(row, BaseTableRowPlugin.node.type)) {
    return cellPath;
  }

  // If it is the last cell in the row, do nothing.
  if (cellNode === row.children.at(-1)) {
    return cellPath;
  }

  const nextEntry = getNextNode<TableCellElement>(editor, {
    at: cellPath,
    match: isOfElementTypeFn(BaseTableCellPlugin.node.type),
  });

  if (nextEntry === undefined) {
    return cellPath;
  }

  const [nextCell, nextPath] = nextEntry;

  withoutNormalizing(editor, () => {
    mergeNodes(editor, { at: nextPath });
    mergeNodes(editor, {
      at: cellPath,
      match: (n) => isOfElementType<ParagraphElement>(n, BaseParagraphPlugin.node.type) && isElementEmpty(editor, n),
    });

    const colSpan = (cellNode.colSpan ?? 1) + (nextCell.colSpan ?? 1);

    setNodes(editor, { colSpan }, { at: cellPath });
  });

  return cellPath;
};
