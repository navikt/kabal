import { Editor, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableContentEnum } from '../../types/editor-enums';
import { isOfElementTypeFn } from '../../types/editor-type-guards';
import { TableRowElementType } from '../../types/editor-types';
import { createCell } from './create-helpers';
import { getCellColumnOffset, getCurrentRow } from './helpers';
import { TableFn } from './types';

const DOCUMENT_CONTENT_WIDTH = 642;
const MIN_CELL_WIDTH = 32;
const MAX_COLUMNS = Math.floor(DOCUMENT_CONTENT_WIDTH / MIN_CELL_WIDTH);

export const insertColumnRight: TableFn = (editor, cellNode, cellPath = ReactEditor.findPath(editor, cellNode)) => {
  const currentRowEntry = getCurrentRow(editor, cellNode, cellPath);

  if (currentRowEntry === undefined) {
    return cellPath;
  }

  const [currentRow, currentRowPath] = currentRowEntry;

  const totalRowColSpan = currentRow.children.reduce((acc, cell) => acc + cell.colSpan, 0);

  if (totalRowColSpan === MAX_COLUMNS) {
    return cellPath;
  }

  const columnOffset = getCellColumnOffset(editor, cellNode, currentRow);
  const columns = columnOffset + cellNode.colSpan;

  const tableBodyPath = Path.parent(currentRowPath);

  const rows = Editor.nodes<TableRowElementType>(editor, {
    at: tableBodyPath,
    match: isOfElementTypeFn<TableRowElementType>(TableContentEnum.TR),
    mode: 'lowest',
    voids: false,
  });

  let shouldFocusNewColumn = false;

  Editor.withoutNormalizing(editor, () => {
    for (const [rowNode, rowPath] of rows) {
      let currentColumn = 0;

      for (const [i, cell] of rowNode.children.entries()) {
        currentColumn += cell.colSpan;

        if (currentColumn > columns) {
          // Expand the cell by one column.
          Transforms.setNodes(
            editor,
            { colSpan: cell.colSpan + 1 },
            {
              at: rowPath,
              match: (n) => n === cell,
            }
          );
          break;
        }

        if (currentColumn === columns) {
          // Insert a new cell after the current cell.
          Transforms.insertNodes(editor, createCell(), {
            at: [...rowPath, i + 1],
          });
          shouldFocusNewColumn = shouldFocusNewColumn || cell === cellNode;
          break;
        }
      }
    }
  });

  return shouldFocusNewColumn ? Path.next(cellPath) : cellPath;
};

export const insertColumnLeft: TableFn = (editor, cellNode, cellPath = ReactEditor.findPath(editor, cellNode)) => {
  const currentRowEntry = getCurrentRow(editor, cellNode, cellPath);

  if (currentRowEntry === undefined) {
    return cellPath;
  }

  const [currentRow, currentRowPath] = currentRowEntry;

  const totalRowColSpan = currentRow.children.reduce((acc, cell) => acc + cell.colSpan, 0);

  if (totalRowColSpan === MAX_COLUMNS) {
    return cellPath;
  }

  const columnOffset = getCellColumnOffset(editor, cellNode, currentRow);

  const tableBodyPath = Path.parent(currentRowPath);

  const rows = Editor.nodes<TableRowElementType>(editor, {
    at: tableBodyPath,
    match: isOfElementTypeFn<TableRowElementType>(TableContentEnum.TR),
    mode: 'lowest',
    voids: false,
  });

  Editor.withoutNormalizing(editor, () => {
    for (const [rowNode, rowPath] of rows) {
      let currentColumn = totalRowColSpan;

      const children = [...rowNode.children].reverse();

      for (const [i, cell] of children.entries()) {
        currentColumn -= cell.colSpan;

        if (currentColumn < columnOffset) {
          // Expand the cell by one column.
          Transforms.setNodes(
            editor,
            { colSpan: cell.colSpan + 1 },
            {
              at: rowPath,
              match: (n) => n === cell,
            }
          );
          break;
        }

        if (currentColumn === columnOffset) {
          // Insert a new cell before the current cell.
          Transforms.insertNodes(editor, createCell(), {
            at: [...rowPath, children.length - 1 - i], // Because we have reversed the children array.
          });
          break;
        }
      }
    }
  });

  return cellPath;
};
