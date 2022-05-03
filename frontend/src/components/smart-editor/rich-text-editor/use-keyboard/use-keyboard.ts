import React, { useCallback, useContext } from 'react';
import { Editor, Point, Range, Transforms } from 'slate';
import { SmartEditorContext } from '../../context/smart-editor-context';
import {
  ContentTypeEnum,
  ListContentEnum,
  ListItemContainerElementType,
  ListTypesEnum,
  MarkKeys,
  isOfElementType,
} from '../../editor-types';
import { createNewParagraph, getSelectedListTypes, isBlockActive } from '../../toolbar/functions/blocks';
import { toggleMark } from '../../toolbar/functions/marks';
import { indentList } from '../slate-event-handlers/list/indent';
import { unindentList } from '../slate-event-handlers/list/unindent';
import { addTab, removeTab } from '../slate-event-handlers/tabs/collapsed-selection';
import { addTabs, removeTabs } from '../slate-event-handlers/tabs/expanded-selection';
import { selectAll } from './select-all';

export const useKeyboard = (editor: Editor) => {
  const { setShowNewComment } = useContext(SmartEditorContext);

  return useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Backspace') {
        if (isBlockActive(editor, ListContentEnum.LIST_ITEM_CONTAINER) && editor.selection?.focus.offset === 0) {
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

          if (Range.isCollapsed(editor.selection) && Point.equals(editor.selection?.focus, start)) {
            event.preventDefault();
            unindentList(editor);
            return;
          }
        }
      }

      if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
        Transforms.insertText(editor, '\n');
        return;
      }

      if (!event.shiftKey && event.key === 'Enter') {
        event.preventDefault();

        if (
          getSelectedListTypes(editor)[ListTypesEnum.BULLET_LIST] ||
          getSelectedListTypes(editor)[ListTypesEnum.NUMBERED_LIST]
        ) {
          const [firstEntry] = Editor.nodes<ListItemContainerElementType>(editor, {
            mode: 'lowest',
            reverse: true,
            match: (n) => isOfElementType<ListItemContainerElementType>(n, ListContentEnum.LIST_ITEM_CONTAINER),
          });

          if (firstEntry === undefined) {
            return;
          }

          const [element, path] = firstEntry;

          if (Editor.isEmpty(editor, element)) {
            Editor.withoutNormalizing(editor, () => {
              for (let i = 1; i < path.length; i++) {
                Transforms.liftNodes(editor);
              }

              Transforms.setNodes(editor, { type: ContentTypeEnum.PARAGRAPH });
            });
            return;
          }

          Transforms.splitNodes(editor, { always: true, match: (n) => isOfElementType(n, ListContentEnum.LIST_ITEM) });
          return;
        }

        createNewParagraph(editor);
        return;
      }

      if (event.key === 'Tab') {
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
          if (editor.selection === null) {
            return;
          }

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

        return;
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'b': {
            event.preventDefault();
            toggleMark(editor, MarkKeys.bold);
            return;
          }

          case 'i': {
            event.preventDefault();
            toggleMark(editor, MarkKeys.italic);
            return;
          }

          case 'u': {
            event.preventDefault();
            toggleMark(editor, MarkKeys.underline);
            return;
          }

          case 's': {
            event.preventDefault();
            break;
          }

          case 'k': {
            event.preventDefault();
            setShowNewComment(true);
            break;
          }

          case 'a': {
            selectAll(event, editor);
            break;
          }

          default:
        }
      }
    },
    [editor, setShowNewComment]
  );
};
