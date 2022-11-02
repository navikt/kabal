import { Editor, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableContentEnum } from '../../types/editor-enums';
import { isOfElementType, isOfElementTypeFn } from '../../types/editor-type-guards';
import { TableRowElementType } from '../../types/editor-types';
import { TableFn } from './types';

export const mergeCells: TableFn = (editor, element) => {
  const cellPath = ReactEditor.findPath(editor, element);
  const [row] = Editor.parent(editor, cellPath);

  if (!isOfElementType<TableRowElementType>(row, TableContentEnum.TR)) {
    return cellPath;
  }

  // If it is the last cell in the row, do nothing.
  if (element === row.children[row.children.length - 1]) {
    return cellPath;
  }

  const nextPath = Path.next(cellPath);
  const nextCell = row.children[row.children.indexOf(element) + 1];

  if (nextCell === undefined) {
    return cellPath;
  }

  Editor.withoutNormalizing(editor, () => {
    Transforms.mergeNodes(editor, { at: nextPath });
    Transforms.setNodes(editor, { colSpan: element.colSpan + nextCell.colSpan }, { at: cellPath });
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
