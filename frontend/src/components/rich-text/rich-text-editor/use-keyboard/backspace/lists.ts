import { Editor } from 'slate';
import { ListContentEnum } from '../../../types/editor-enums';
import { isOfElementType } from '../../../types/editor-type-guards';
import { ListItemContainerElementType } from '../../../types/editor-types';
import { unindentList } from '../../slate-event-handlers/list/unindent';
import { HandlerFn } from '../types';

export const handleLists: HandlerFn = ({ editor, event, isCollapsed, currentElementEntry: [currentElement, path] }) => {
  if (
    !isCollapsed ||
    editor.selection.focus.offset !== 0 ||
    !isOfElementType<ListItemContainerElementType>(currentElement, ListContentEnum.LIST_ITEM_CONTAINER) ||
    !Editor.isStart(editor, editor.selection.focus, path)
  ) {
    return;
  }

  event.preventDefault();
  unindentList(editor);
};
