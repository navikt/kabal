import { Range } from 'slate';
import { getSelectedListTypes, isBlockActive } from '../../functions/blocks';
import { ContentTypeEnum, ListTypesEnum } from '../../types/editor-enums';
import { indentList } from '../slate-event-handlers/list/indent';
import { unindentList } from '../slate-event-handlers/list/unindent';
import { addTab, removeTab } from '../slate-event-handlers/tabs/collapsed-selection';
import { addTabs, removeTabs } from '../slate-event-handlers/tabs/expanded-selection';
import { HandlerFn } from './types';

export const tab: HandlerFn = ({ editor, event }) => {
  event.preventDefault();

  if (
    getSelectedListTypes(editor)[ListTypesEnum.BULLET_LIST] ||
    getSelectedListTypes(editor)[ListTypesEnum.NUMBERED_LIST]
  ) {
    if (event.shiftKey) {
      unindentList(editor);

      return;
    }

    indentList(editor);

    return;
  }

  if (isBlockActive(editor, ContentTypeEnum.PARAGRAPH)) {
    if (Range.isCollapsed(editor.selection)) {
      if (event.shiftKey) {
        return removeTab(editor);
      }

      return addTab(editor);
    }

    if (event.shiftKey) {
      return removeTabs(editor);
    }

    return addTabs(editor);
  }
};
