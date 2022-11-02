import { Editor, Node, NodeEntry, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableContentEnum } from '../../types/editor-enums';
import { isOfElementType, isOfElementTypeFn } from '../../types/editor-type-guards';
import { TableCellElementType, TableRowElementType } from '../../types/editor-types';

const findPath = (editor: Editor, node: Node | undefined = undefined): Path | undefined =>
  node === undefined ? undefined : ReactEditor.findPath(editor, node);

// Cell helpers
export const getCurrentCell = (editor: Editor): NodeEntry<TableCellElementType> | undefined => {
  const [entry] = Editor.nodes<TableCellElementType>(editor, {
    match: isOfElementTypeFn<TableCellElementType>(TableContentEnum.TD),
  });

  return entry;
};

export const getCellColumnOffset = (
  editor: Editor,
  currentCell: TableCellElementType | undefined = getCurrentCell(editor)?.[0],
  currentRow: TableRowElementType | undefined = getCurrentRow(editor, currentCell)?.[0]
): number => {
  if (currentCell === undefined || currentRow === undefined) {
    return 0;
  }
  const index = currentRow.children.indexOf(currentCell);
  const columns = currentRow.children.slice(0, index).reduce((acc, c) => acc + c.colSpan, 0);

  return columns;
};

// Row helpers
export const getCurrentRow = (
  editor: Editor,
  currentCell: TableCellElementType | undefined = getCurrentCell(editor)?.[0],
  currentCellPath = findPath(editor, currentCell)
): NodeEntry<TableRowElementType> | undefined => {
  const [currentRowEntry] = Editor.nodes<TableRowElementType>(editor, {
    at: currentCellPath,
    match: isOfElementTypeFn<TableRowElementType>(TableContentEnum.TR),
  });

  return currentRowEntry;
};

export const getNextRow = (
  editor: Editor,
  currentRowPath: Path | undefined = getCurrentRow(editor)?.[1]
): NodeEntry<TableRowElementType> | undefined => {
  if (currentRowPath === undefined) {
    return undefined;
  }

  const nextRowPath = Path.next(currentRowPath);

  if (!Editor.hasPath(editor, nextRowPath)) {
    return undefined;
  }

  const targetRowEntry = Editor.node(editor, nextRowPath);

  if (targetRowEntry === undefined) {
    return undefined;
  }

  const [targetRow, targetRowPath] = targetRowEntry;

  if (!isOfElementType<TableRowElementType>(targetRow, TableContentEnum.TR)) {
    return undefined;
  }

  return [targetRow, targetRowPath];
};

export const getPreviousRow = (
  editor: Editor,
  currentRowPath: Path | undefined = getCurrentRow(editor)?.[1]
): NodeEntry<TableRowElementType> | undefined => {
  if (currentRowPath === undefined) {
    return undefined;
  }

  if (!Path.hasPrevious(currentRowPath)) {
    return undefined;
  }

  const nextRowPath = Path.previous(currentRowPath);

  if (!Editor.hasPath(editor, nextRowPath)) {
    return undefined;
  }

  const targetRowEntry = Editor.node(editor, nextRowPath);

  if (targetRowEntry === undefined) {
    return undefined;
  }

  const [targetRow, targetRowPath] = targetRowEntry;

  if (!isOfElementType<TableRowElementType>(targetRow, TableContentEnum.TR)) {
    return undefined;
  }

  return [targetRow, targetRowPath];
};
