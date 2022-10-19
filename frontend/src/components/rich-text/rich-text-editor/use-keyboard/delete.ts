import { Editor, Path, Range, Transforms } from 'slate';
import { isPlaceholderSelectedInMaltekstWithOverlap } from '../../functions/insert-placeholder';
import { getLeadingCharacters, getLeadingSpaces } from './helpers';
import { HandlerFn } from './types';

export const deleteHandler: HandlerFn = ({ editor, event }) => {
  if (isPlaceholderSelectedInMaltekstWithOverlap(editor)) {
    event.preventDefault();

    return;
  }

  const isCollapsed = Range.isCollapsed(editor.selection);

  if ((event.altKey || event.ctrlKey || event.metaKey) && isCollapsed) {
    const parentPath = Path.parent(editor.selection.focus.path);

    // If at end of element, use default behavior.
    if (Editor.isEnd(editor, editor.selection.focus, parentPath)) {
      return;
    }

    event.preventDefault();

    const at: Range = {
      anchor: editor.selection.anchor,
      focus: Editor.end(editor, [...parentPath, 0]),
    };

    // Delete line.
    if (event.metaKey) {
      Transforms.delete(editor, {
        unit: 'character',
        at,
        reverse: false,
      });

      return;
    }

    // Delete word.
    const string = Editor.string(editor, at);
    const spaces = getLeadingSpaces(string);
    const distance = spaces === 0 ? getLeadingCharacters(string) : spaces;

    Transforms.delete(editor, {
      unit: 'character',
      distance,
      at: editor.selection,
      reverse: false,
    });
  }
};
