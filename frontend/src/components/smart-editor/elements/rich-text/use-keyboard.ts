import React, { useCallback } from 'react';
import { Editor, Point, Transforms } from 'slate';
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
            Editor.withoutNormalizing(editor, () => {
              Transforms.liftNodes(editor);
              Transforms.setNodes(editor, { type: ContentTypeEnum.PARAGRAPH });
            });
            return;
          }
        }
      }

      if (event.shiftKey && event.key === 'Enter') {
        // https://github.com/ianstormtaylor/slate/issues/3911
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
