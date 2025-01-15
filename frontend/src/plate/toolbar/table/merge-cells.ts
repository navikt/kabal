import { getCurrentRow } from '@app/plate/toolbar/table/helpers';
import type { ParagraphElement, RichTextEditor, TableCellElement, TableRowElement } from '@app/plate/types';
import { isOfElementType, isOfElementTypeFn } from '@app/plate/utils/queries';
import { BaseParagraphPlugin } from '@udecode/plate-core';
import { BaseTableCellPlugin, BaseTableRowPlugin } from '@udecode/plate-table';

export const mergeCells = (
  editor: RichTextEditor,
  cellNode: TableCellElement,
  cellPath = editor.api.findPath(cellNode),
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

  const nextEntry = editor.api.next<TableCellElement>({
    at: cellPath,
    match: isOfElementTypeFn(BaseTableCellPlugin.node.type),
  });

  if (nextEntry === undefined) {
    return cellPath;
  }

  const [nextCell, nextPath] = nextEntry;

  editor.tf.withoutNormalizing(() => {
    editor.tf.mergeNodes({ at: nextPath });
    editor.tf.mergeNodes({
      at: cellPath,
      match: (n) => isOfElementType<ParagraphElement>(n, BaseParagraphPlugin.node.type) && editor.api.isEmpty(n),
    });

    const colSpan = (cellNode.colSpan ?? 1) + (nextCell.colSpan ?? 1);

    editor.tf.setNodes({ colSpan }, { at: cellPath });
  });

  return cellPath;
};
