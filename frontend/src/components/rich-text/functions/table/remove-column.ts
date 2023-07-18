import { Editor, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableContentEnum } from '../../types/editor-enums';
import { isOfElementType, isOfElementTypeFn } from '../../types/editor-type-guards';
import { TableRowElementType } from '../../types/editor-types';
import { TableFn } from './types';

export const removeColumn: TableFn = (editor, element) => {
  const cellPath = ReactEditor.findPath(editor, element);

  const [currentRow, currentRowPath] = Editor.parent(editor, cellPath);

  if (!isOfElementType<TableRowElementType>(currentRow, TableContentEnum.TR)) {
    return cellPath;
  }

  let startColumns = 0;

  for (const cell of currentRow.children) {
    if (cell === element) {
      break;
    }
    startColumns += cell.colSpan;
  }

  const endColumns = startColumns + element.colSpan;

  const tableBodyPath = Path.parent(currentRowPath);

  const rows = Editor.nodes<TableRowElementType>(editor, {
    at: tableBodyPath,
    match: isOfElementTypeFn<TableRowElementType>(TableContentEnum.TR),
    mode: 'lowest',
    voids: false,
  });

  Editor.withoutNormalizing(editor, () => {
    for (const [rowNode, rowPath] of rows) {
      // The current distance from the start of the row in columns.
      let currentColumn = 0;

      for (const cell of rowNode.children) {
        if (cell === element) {
          if (cell.colSpan === 1) {
            // Remove the cell.
            Transforms.removeNodes(editor, { at: rowPath, match: (n) => n === cell });
            break;
          }
          // Reduce the cell by one column.
          Transforms.setNodes(editor, { colSpan: cell.colSpan - 1 }, { at: rowPath, match: (n) => n === cell });
          break;
        }

        if (currentColumn === startColumns && cell.colSpan <= element.colSpan) {
          // Remove the cell.
          Transforms.removeNodes(editor, { at: rowPath, match: (n) => n === cell });
          break;
        }

        // If the cell starts before or at and ends after or at the current cell.
        // If the cell spans more colums than the current cell.
        if (
          currentColumn <= startColumns &&
          currentColumn + cell.colSpan >= endColumns &&
          cell.colSpan > element.colSpan
        ) {
          // Contract the cell.
          Transforms.setNodes(
            editor,
            { colSpan: cell.colSpan - element.colSpan },
            {
              at: rowPath,
              match: (n) => n === cell,
            },
          );
          break;
        }

        currentColumn += cell.colSpan;
      }
    }
  });

  if (Editor.hasPath(editor, cellPath)) {
    return cellPath;
  }

  if (Path.hasPrevious(cellPath)) {
    return Path.previous(cellPath);
  }

  return cellPath;
};
