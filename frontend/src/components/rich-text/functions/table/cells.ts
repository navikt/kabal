import { Editor, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableContentEnum } from '../../types/editor-enums';
import { isOfElementType, isOfElementTypeFn } from '../../types/editor-type-guards';
import { TableCellElementType, TableRowElementType } from '../../types/editor-types';
import { getCurrentRow } from './helpers';
import { TableFn } from './types';

export const mergeCells: TableFn = (editor, cellNode, cellPath = ReactEditor.findPath(editor, cellNode)) => {
  const rowEntry = getCurrentRow(editor, cellNode, cellPath);

  if (rowEntry === undefined) {
    return cellPath;
  }

  const [row] = rowEntry;

  if (!isOfElementType<TableRowElementType>(row, TableContentEnum.TR)) {
    return cellPath;
  }

  // If it is the last cell in the row, do nothing.
  if (cellNode === row.children[row.children.length - 1]) {
    return cellPath;
  }

  const nextEntry = Editor.next(editor, {
    at: cellPath,
    match: isOfElementTypeFn<TableCellElementType>(TableContentEnum.TD),
  });

  if (nextEntry === undefined) {
    return cellPath;
  }

  const [nextCell, nextPath] = nextEntry;

  Editor.withoutNormalizing(editor, () => {
    Transforms.mergeNodes(editor, { at: nextPath });
    Transforms.setNodes(editor, { colSpan: cellNode.colSpan + nextCell.colSpan }, { at: cellPath });
  });

  return cellPath;
};

export const splitCell: TableFn = (editor, element) => {
  const cellPath = ReactEditor.findPath(editor, element);

  if (element.colSpan === 1) {
    return cellPath;
  }

  Editor.withoutNormalizing(editor, () => {
    Transforms.splitNodes(editor, { match: isOfElementTypeFn(TableContentEnum.TD), always: true });
    const colSpanLeft = Math.ceil(element.colSpan / 2);
    const colSpanRight = element.colSpan - colSpanLeft;
    Transforms.setNodes(editor, { colSpan: colSpanLeft }, { at: cellPath });
    Transforms.setNodes(editor, { colSpan: colSpanRight }, { at: Path.next(cellPath) });
  });

  return cellPath;
};
