import { Editor, Path, Point, Range, Text, Transforms } from 'slate';
import { moveLeft, moveRight } from '../../functions/arrows';
import { isBlockActive } from '../../functions/blocks';
import {
  getCellColumnOffset,
  getCurrentCell,
  getCurrentRow,
  getNextRow,
  getPreviousRow,
} from '../../functions/table/helpers';
import { TableTypeEnum } from '../../types/editor-enums';
import { getLeadingCharacters, getLeadingSpaces, getTrailingCharacters, getTrailingSpaces } from './helpers';
import { HandlerFn } from './types';

export const arrowLeft: HandlerFn = ({ event, editor }) => {
  if (event.ctrlKey || event.altKey) {
    const isExpanded = Range.isExpanded(editor.selection);

    if (isExpanded && !event.shiftKey) {
      return;
    }

    event.preventDefault();

    const parentPath = Path.parent(editor.selection.focus.path);
    const path = [...parentPath, 0];
    const at: Range = {
      anchor: {
        path,
        offset: 0,
      },
      focus: editor.selection.focus,
    };
    const string = Editor.string(editor, at);
    const spaces = getTrailingSpaces(string);
    const distance = spaces === 0 ? getTrailingCharacters(string) : spaces;

    Transforms.move(editor, {
      unit: distance === 0 ? 'offset' : 'character',
      distance: distance === 0 ? 1 : distance,
      reverse: true,
      edge: event.shiftKey ? 'focus' : undefined,
    });

    return;
  }

  // Make the caret move predictably when using arrow keys. Not skipping over text before or after flettefelt.
  if (event.shiftKey || event.metaKey) {
    return;
  }

  moveLeft(editor, event);
};

export const arrowRight: HandlerFn = ({ event, editor }) => {
  if (event.ctrlKey || event.altKey) {
    const isExpanded = Range.isExpanded(editor.selection);

    if (isExpanded && !event.shiftKey) {
      return;
    }

    event.preventDefault();

    const parentPath = Path.parent(editor.selection.focus.path);
    const at: Range = {
      anchor: editor.selection.focus,
      focus: Editor.end(editor, parentPath),
    };
    const string = Editor.string(editor, at);
    const spaces = getLeadingSpaces(string);
    const distance = spaces === 0 ? getLeadingCharacters(string) : spaces;

    Transforms.move(editor, {
      unit: distance === 0 ? 'offset' : 'character',
      distance: distance === 0 ? 1 : distance,
      reverse: false,
      edge: event.shiftKey ? 'focus' : undefined,
    });

    return;
  }

  // Make the caret move predictably when using arrow keys. Not skipping over text before or after flettefelt.
  if (event.shiftKey || event.metaKey) {
    return;
  }

  moveRight(editor, event);
};

export const arrowUp: HandlerFn = ({ event, editor }) => {
  if (isBlockActive(editor, TableTypeEnum.TABLE)) {
    event.preventDefault();
    moveToTargetRow(editor, Direction.UP);
  }
};

export const arrowDown: HandlerFn = ({ event, editor }) => {
  if (isBlockActive(editor, TableTypeEnum.TABLE)) {
    event.preventDefault();
    moveToTargetRow(editor, Direction.DOWN);
  }
};

enum Direction {
  UP = 'up',
  DOWN = 'down',
}

const moveToTargetRow = (editor: Editor, direction: Direction): void => {
  const currentCellEntry = getCurrentCell(editor);

  if (currentCellEntry === undefined) {
    return;
  }
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

    Transforms.select(editor, {
      path: targetPath,
      offset: 0,
    });

    return;
  }

  const columns = getCellColumnOffset(editor, currentCell, currentRow);

  const [targetRow, targetRowPath] = targetRowEntry;
  // Find cell with same distance from left edge.
  let distance = 0;

  for (const cell of targetRow.children) {
    distance += cell.colSpan;

    if (distance < columns) {
      continue;
    }

    const offset = distance > columns ? 0 : 1;
    const path: Path = [...targetRowPath, targetRow.children.indexOf(cell) + offset, 0];
    const point: Point = { path, offset: 0 };
    const range: Range = { anchor: point, focus: point };
    Transforms.select(editor, range);

    return;
  }
};
