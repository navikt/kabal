import { Editor, Element, Path, Range, Transforms } from 'slate';
import { moveLeft, moveRight } from '../../../functions/arrows';
import { isBlockActive } from '../../../functions/blocks';
import { getCurrentCell } from '../../../functions/table/helpers';
import { TableContentEnum, TableTypeEnum } from '../../../types/editor-enums';
import { isOfElementTypes } from '../../../types/editor-type-guards';
import { TableBodyElementType, TableCellElementType, TableRowElementType } from '../../../types/editor-types';
import { getLeadingCharacters, getLeadingSpaces, getTrailingCharacters, getTrailingSpaces } from '../helpers';
import { HandlerFn } from '../types';
import { Direction, moveToTargetRow } from './table';

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

export const arrowUp: HandlerFn = (args) => {
  const { editor, event } = args;

  if (isBlockActive(editor, TableTypeEnum.TABLE)) {
    const tableCell = getCurrentCell(editor);

    if (typeof tableCell === 'undefined') {
      return;
    }

    const [, tableCellPath] = tableCell;

    if (Editor.isStart(editor, editor.selection.focus, tableCellPath)) {
      event.preventDefault();
      moveToTargetRow(editor, tableCell, Direction.UP);

      return;
    }

    const startPoint = Editor.start(editor, tableCellPath);

    if (Path.equals(startPoint.path, editor.selection.focus.path)) {
      event.preventDefault();
      Transforms.select(editor, startPoint);

      return;
    }

    const previousEntry = Editor.previous<Element>(editor, {
      at: editor.selection.focus,
      match: (n) =>
        Element.isElement(n) &&
        !isOfElementTypes<TableCellElementType | TableRowElementType | TableBodyElementType>(n, [
          TableContentEnum.TD,
          TableContentEnum.TR,
          TableContentEnum.TBODY,
        ]),
      mode: 'lowest',
    });

    if (typeof previousEntry !== 'undefined') {
      return;
    }

    event.preventDefault();
    moveToTargetRow(editor, tableCell, Direction.UP);
  }
};

export const arrowDown: HandlerFn = (args) => {
  const { editor, event } = args;

  if (isBlockActive(editor, TableTypeEnum.TABLE)) {
    const tableCell = getCurrentCell(editor);

    if (typeof tableCell === 'undefined') {
      return;
    }

    const [, tableCellPath] = tableCell;

    if (Editor.isEnd(editor, editor.selection.focus, tableCellPath)) {
      event.preventDefault();
      moveToTargetRow(editor, tableCell, Direction.DOWN);

      return;
    }

    const startPoint = Editor.end(editor, tableCellPath);

    if (Path.equals(startPoint.path, editor.selection.focus.path)) {
      event.preventDefault();
      Transforms.select(editor, startPoint);

      return;
    }

    const nextEntry = Editor.next<Element>(editor, {
      at: editor.selection.focus,
      match: (n) =>
        Element.isElement(n) &&
        !isOfElementTypes<TableCellElementType | TableRowElementType | TableBodyElementType>(n, [
          TableContentEnum.TD,
          TableContentEnum.TR,
          TableContentEnum.TBODY,
        ]),
      mode: 'lowest',
    });

    if (typeof nextEntry !== 'undefined') {
      return;
    }

    event.preventDefault();
    moveToTargetRow(editor, tableCell, Direction.DOWN);
  }
};
