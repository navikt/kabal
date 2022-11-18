import { Editor, Path, Range, Transforms } from 'slate';
import { isPlaceholderSelectedInMaltekstWithOverlap } from '../../functions/insert-placeholder';
import { handleLists } from './backspace/lists';
import { handleParagraph } from './backspace/paragraph';
import { handleTableCell } from './backspace/table-cell';
import { getTrailingCharacters, getTrailingSpaces } from './helpers';
import { HandlerFn } from './types';

const HANDLERS: HandlerFn[] = [handleTableCell, handleParagraph, handleLists];

export const backspace: HandlerFn = (args) => {
  const { editor, event } = args;

  if (isPlaceholderSelectedInMaltekstWithOverlap(editor)) {
    event.preventDefault();

    return;
  }

  const isCollapsed = Range.isCollapsed(editor.selection);

  if ((event.altKey || event.ctrlKey || event.metaKey) && isCollapsed) {
    const parentPath = Path.parent(editor.selection.focus.path);
    const path = [...parentPath, 0];

    // If at start of element, use default behavior.
    if (Editor.isStart(editor, editor.selection.focus, path)) {
      return;
    }

    event.preventDefault();

    const at: Range = {
      anchor: {
        path,
        offset: 0,
      },
      focus: editor.selection.focus,
    };

    // Delete line.
    if (event.metaKey) {
      Transforms.delete(editor, {
        unit: 'character',
        at,
        reverse: true,
      });

      return;
    }

    // Delete word.
    const string = Editor.string(editor, at);
    const spaces = getTrailingSpaces(string);
    const distance = spaces === 0 ? getTrailingCharacters(string) : spaces;

    Transforms.delete(editor, {
      unit: 'character',
      distance,
      at: editor.selection,
      reverse: true,
    });

    return;
  }

  HANDLERS.forEach((handler) => {
    if (!event.defaultPrevented) {
      handler(args);
    }
  });
};
