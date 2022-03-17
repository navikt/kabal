import React, { useCallback } from 'react';
import { Editor, Element, Point, Transforms } from 'slate';
import { ContentTypeEnum, ListItemElementType, ListTypesEnum, MarkKeys, isOfElementType } from '../../editor-types';
import { addBlock, areBlocksActive, createNewParagraph, isBlockActive } from '../../toolbar/functions/blocks';
import { toggleMark } from '../../toolbar/functions/marks';

export const useKeyboard = (editor: Editor) =>
  useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Backspace') {
        if (isBlockActive(editor, ListTypesEnum.LIST_ITEM) && editor.selection?.focus.offset === 0) {
          const [[, path]] = Editor.nodes<ListItemElementType>(editor, {
            mode: 'lowest',
            reverse: true,
            match: (n) => isOfElementType<ListItemElementType>(n, ListTypesEnum.LIST_ITEM),
          });
          const start = Editor.start(editor, path);

          if (Point.equals(editor.selection?.focus, start)) {
            event.preventDefault();
            Transforms.liftNodes(editor, {
              match: (n) => isOfElementType(n, ListTypesEnum.LIST_ITEM),
            });
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

        if (areBlocksActive(editor, [ListTypesEnum.BULLET_LIST, ListTypesEnum.NUMBERED_LIST])) {
          const [[element]] = Editor.nodes<ListItemElementType>(editor, {
            mode: 'lowest',
            reverse: true,
            match: (n) => isOfElementType<ListItemElementType>(n, ListTypesEnum.LIST_ITEM),
          });

          if (Editor.isEmpty(editor, element)) {
            Editor.withoutNormalizing(editor, () => {
              Transforms.liftNodes(editor);
              Transforms.setNodes(editor, { type: ContentTypeEnum.PARAGRAPH });
            });
            return;
          }

          addBlock(editor, ListTypesEnum.LIST_ITEM);
          return;
        }

        createNewParagraph(editor);
        return;
      }

      if (event.key === 'Tab') {
        event.preventDefault();

        if (event.shiftKey) {
          Transforms.liftNodes(editor, {
            match: (n) => Element.isElement(n) && n.type === ListTypesEnum.LIST_ITEM,
          });
          return;
        }

        if (isBlockActive(editor, ListTypesEnum.BULLET_LIST)) {
          Transforms.wrapNodes(editor, {
            type: ListTypesEnum.BULLET_LIST,
            children: [
              {
                type: ListTypesEnum.LIST_ITEM,
                children: [{ text: '' }],
              },
            ],
          });
        }

        if (isBlockActive(editor, ListTypesEnum.NUMBERED_LIST)) {
          Transforms.wrapNodes(editor, {
            type: ListTypesEnum.NUMBERED_LIST,
            children: [
              {
                type: ListTypesEnum.LIST_ITEM,
                children: [{ text: '' }],
              },
            ],
          });
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
