import { Editor, NodeEntry, Path, Point, Range, Text, Transforms } from 'slate';
import { getCellColumnOffset, getCurrentRow, getNextRow, getPreviousRow } from '../../../functions/table/helpers';
import { TableCellElementType } from '../../../types/editor-types';

export enum Direction {
  UP = 'up',
  DOWN = 'down',
}

export const moveToTargetRow = (
  editor: Editor,
  currentCellEntry: NodeEntry<TableCellElementType>,
  direction: Direction,
): void => {
  const [currentCell, currentCellPath] = currentCellEntry;
  const currentRowEntry = getCurrentRow(editor, currentCell, currentCellPath);

  if (currentRowEntry === undefined) {
    return;
  }

  const [currentRow, currentRowPath] = currentRowEntry;
  const targetRowEntry = (direction === Direction.UP ? getPreviousRow : getNextRow)(editor, currentRowPath);

  // If at edge of table, go to previous/next text.
  if (targetRowEntry === undefined) {
    const target = (direction === Direction.UP ? Editor.previous : Editor.next)(editor, {
      match: Text.isText,
      at: currentRowPath,
      mode: 'lowest',
      voids: false,
    });

    if (target === undefined) {
      return;
    }

    const [, targetPath] = target;

    Transforms.select(editor, { path: targetPath, offset: 0 });

    return;
  }

  const currentColumnCount = getCellColumnOffset(editor, currentCell, currentRow);

  const [targetRow, targetRowPath] = targetRowEntry;
  // Find cell with same distance from left edge.
  let targetColumnCount = 0;

  for (const [i, cell] of targetRow.children.entries()) {
    targetColumnCount += cell.colSpan;

    if (targetColumnCount < currentColumnCount) {
      continue;
    }

    const columnOffset = targetColumnCount > currentColumnCount ? 0 : 1;
    const targetCellPath: Path = [...targetRowPath, i + columnOffset];

    const [last, path] = (direction === Direction.UP ? Editor.last : Editor.first)(editor, targetCellPath);

    if (Text.isText(last)) {
      const offset: number = direction === Direction.UP ? last.text.length : 0;
      const point: Point = { path, offset };
      const range: Range = { anchor: point, focus: point };
      Transforms.select(editor, range);

      return;
    }
  }
};
