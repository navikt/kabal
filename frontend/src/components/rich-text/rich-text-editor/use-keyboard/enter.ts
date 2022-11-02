import { Editor, Transforms } from 'slate';
import { createNewParagraph, getSelectedListTypes, isBlockActive } from '../../functions/blocks';
import { containsVoid } from '../../functions/contains-void';
import { insertPageBreak } from '../../functions/insert-page-break';
import { insertColumn } from '../../functions/table/insert-column';
import { insertRowBelow } from '../../functions/table/rows';
import {
  ContentTypeEnum,
  ListContentEnum,
  ListTypesEnum,
  TableContentEnum,
  TableTypeEnum,
} from '../../types/editor-enums';
import { isOfElementTypeFn } from '../../types/editor-type-guards';
import { ListItemContainerElementType, TableCellElementType } from '../../types/editor-types';
import { HandlerFn } from './types';

export const enter: HandlerFn = ({ editor, event }) => {
  if (containsVoid(editor, editor.selection)) {
    event.preventDefault();

    return;
  }

  if (event.shiftKey) {
    event.preventDefault();
    Transforms.insertText(editor, '\n');

    return;
  }

  if (isBlockActive(editor, TableTypeEnum.TABLE)) {
    event.preventDefault();

    const [cellEntry] = Editor.nodes<TableCellElementType>(editor, { match: isOfElementTypeFn(TableContentEnum.TD) });

    if (cellEntry === undefined) {
      return;
    }

    const [cell, path] = cellEntry;

    const selection =
      event.ctrlKey || event.metaKey ? insertColumn(editor, cell, path) : insertRowBelow(editor, cell, path);
    Transforms.select(editor, selection);

    return;
  }

  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
    insertPageBreak(editor);

    return;
  }

  if (!event.shiftKey) {
    event.preventDefault();

    if (
      getSelectedListTypes(editor)[ListTypesEnum.BULLET_LIST] ||
      getSelectedListTypes(editor)[ListTypesEnum.NUMBERED_LIST]
    ) {
      const [firstEntry] = Editor.nodes<ListItemContainerElementType>(editor, {
        mode: 'lowest',
        reverse: true,
        match: isOfElementTypeFn(ListContentEnum.LIST_ITEM_CONTAINER),
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

      Transforms.splitNodes(editor, { always: true, match: isOfElementTypeFn(ListContentEnum.LIST_ITEM) });

      return;
    }

    createNewParagraph(editor);
  }
};
