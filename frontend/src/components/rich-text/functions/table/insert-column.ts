import { Editor, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableContentEnum } from '../../types/editor-enums';
import { isOfElementType, isOfElementTypeFn } from '../../types/editor-type-guards';
import { TableRowElementType } from '../../types/editor-types';
import { getCellColumnOffset } from './helpers';
import { TableFn } from './types';

const DOCUMENT_CONTENT_WIDTH = 642;
const MIN_CELL_WIDTH = 32;
const MAX_COLUMNS = Math.floor(DOCUMENT_CONTENT_WIDTH / MIN_CELL_WIDTH);

export const insertColumn: TableFn = (editor, element, cellPath = ReactEditor.findPath(editor, element)) => {
  const [currentRow, currentRowPath] = Editor.parent(editor, cellPath);

  if (!isOfElementType<TableRowElementType>(currentRow, TableContentEnum.TR)) {
    return cellPath;
  }
  const existingColumnCount = currentRow.children.reduce((acc, cell) => acc + cell.colSpan, 0);

  if (existingColumnCount === MAX_COLUMNS) {
    return cellPath;
  }

  const columnOffset = getCellColumnOffset(editor, element, currentRow);
  const columns = columnOffset + element.colSpan;

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
          Transforms.insertNodes(
            editor,
            { type: cell.type, colSpan: 1, children: [{ text: '' }] },
            {
              at: [...rowPath, i + 1],
            }
          );
          shouldFocusNewColumn = shouldFocusNewColumn || cell === element;
          break;
        }
      }
    }
  });

  return shouldFocusNewColumn ? Path.next(cellPath) : cellPath;
};
