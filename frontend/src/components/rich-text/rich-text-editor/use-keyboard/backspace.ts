import { Editor, Point, Range } from 'slate';
import { isBlockActive } from '../../functions/blocks';
import { ListContentEnum } from '../../types/editor-enums';
import { isOfElementType } from '../../types/editor-type-guards';
import { ListItemContainerElementType } from '../../types/editor-types';
import { unindentList } from '../slate-event-handlers/list/unindent';
import { HandlerFn } from './types';

export const backspace: HandlerFn = ({ editor, event }) => {
  if (event.key === 'Backspace') {
    if (isBlockActive(editor, ListContentEnum.LIST_ITEM_CONTAINER) && editor.selection.focus.offset === 0) {
      const [firstEntry] = Editor.nodes<ListItemContainerElementType>(editor, {
        mode: 'lowest',
        reverse: true,
        match: (n) => isOfElementType<ListItemContainerElementType>(n, ListContentEnum.LIST_ITEM_CONTAINER),
      });

      if (firstEntry === undefined) {
        return;
      }

      const [, path] = firstEntry;

      const start = Editor.start(editor, path);

      if (Range.isCollapsed(editor.selection) && Point.equals(editor.selection.focus, start)) {
        event.preventDefault();
        unindentList(editor);
      }
    }
  }
};
