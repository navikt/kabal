import { Editor, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableContentEnum } from '../../types/editor-enums';
import { isOfElementType, isOfElementTypeFn } from '../../types/editor-type-guards';
import { TableCellElementType, TableRowElementType } from '../../types/editor-types';
import { createCellContent } from './create-helpers';
import { TableFn } from './types';

enum Direction {
  UP,
  DOWN,
}

export const insertRowAbove = (editor: Editor, element: TableCellElementType, cellPath?: Path) =>
  insertRow(editor, element, cellPath, Direction.UP);
export const insertRowBelow = (editor: Editor, element: TableCellElementType, cellPath?: Path) =>
  insertRow(editor, element, cellPath, Direction.DOWN);

const insertRow = (
  editor: Editor,
  element: TableCellElementType,
  cellPath = ReactEditor.findPath(editor, element),
  direction: Direction = Direction.DOWN,
): Path => {
  const [rowNode, rowPath] = Editor.parent(editor, cellPath);

  if (!isOfElementType<TableRowElementType>(rowNode, TableContentEnum.TR)) {
    return cellPath;
  }

  const newRow: TableRowElementType = {
    type: TableContentEnum.TR,
    children: rowNode.children.map((c) => ({ ...c, children: createCellContent() })),
  };

  const at = direction === Direction.UP ? rowPath : Path.next(rowPath);
  Transforms.insertNodes(editor, newRow, { at });

  return [...at, cellPath.at(-1) ?? 0];
};

export const removeRow: TableFn = (editor, element) => {
  const cellPath = ReactEditor.findPath(editor, element);

  const rowPath = Path.parent(cellPath);

  Transforms.removeNodes(editor, { at: rowPath, match: isOfElementTypeFn(TableContentEnum.TR) });

  if (!Path.hasPrevious(rowPath)) {
    return [...rowPath, cellPath.at(-1) ?? 0];
  }

  return [...Path.previous(rowPath), cellPath.at(-1) ?? 0];
};
