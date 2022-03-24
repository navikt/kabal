import React, { useCallback } from 'react';
import { Editor, Point, Range, Transforms } from 'slate';
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
import { indentList } from './slate-event-handlers/list/indent';
import { unindentList } from './slate-event-handlers/list/unindent';
import { addTab, removeTab } from './slate-event-handlers/tabs/collapsed-selection';
import { addTabs, removeTabs } from './slate-event-handlers/tabs/expanded-selection';

export const useKeyboard = (editor: Editor) =>
  useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Backspace') {
        if (isBlockActive(editor, ListContentEnum.LIST_ITEM_CONTAINER) && editor.selection?.focus.offset === 0) {
          const [[, path]] = Editor.nodes<ListItemContainerElementType>(editor, {
            mode: 'lowest',
            reverse: true,
            match: (n) => isOfElementType<ListItemContainerElementType>(n, ListContentEnum.LIST_ITEM_CONTAINER),
          });

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
          const [[element, path]] = Editor.nodes<ListItemContainerElementType>(editor, {
            mode: 'lowest',
            reverse: true,
            match: (n) => isOfElementType<ListItemContainerElementType>(n, ListContentEnum.LIST_ITEM_CONTAINER),
          });

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

          default:
        }
      }
    },
    [editor]
  );
