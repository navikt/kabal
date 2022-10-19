import { Editor, Path, Point, Range, Transforms } from 'slate';
import { isBlockActive } from '../../functions/blocks';
import { isPlaceholderSelectedInMaltekstWithOverlap } from '../../functions/insert-placeholder';
import { ListContentEnum } from '../../types/editor-enums';
import { isOfElementTypeFn } from '../../types/editor-type-guards';
import { ListItemContainerElementType } from '../../types/editor-types';
import { unindentList } from '../slate-event-handlers/list/unindent';
import { getTrailingCharacters, getTrailingSpaces } from './helpers';
import { HandlerFn } from './types';

export const backspace: HandlerFn = ({ editor, event }) => {
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

  if (isBlockActive(editor, ListContentEnum.LIST_ITEM_CONTAINER) && editor.selection.focus.offset === 0) {
    const [firstEntry] = Editor.nodes<ListItemContainerElementType>(editor, {
      match: isOfElementTypeFn(ListContentEnum.LIST_ITEM_CONTAINER),
      mode: 'lowest',
      reverse: true,
    });

    if (firstEntry === undefined) {
      return;
    }

    const [, path] = firstEntry;

    const start = Editor.start(editor, path);

    if (isCollapsed && Point.equals(editor.selection.focus, start)) {
      event.preventDefault();
      unindentList(editor);
    }
  }
};
