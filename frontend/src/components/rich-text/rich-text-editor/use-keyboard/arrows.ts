import { Editor, Path, Range, Transforms } from 'slate';
import { moveLeft, moveRight } from '../../functions/arrows';
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
