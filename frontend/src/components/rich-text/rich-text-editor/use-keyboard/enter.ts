import { Editor, Transforms } from 'slate';
import { createNewParagraph, getSelectedListTypes } from '../../functions/blocks';
import { containsVoid } from '../../functions/contains-void';
import { insertPageBreak } from '../../functions/insert-page-break';
import { ContentTypeEnum, ListContentEnum, ListTypesEnum } from '../../types/editor-enums';
import { isOfElementTypeFn } from '../../types/editor-type-guards';
import { ListItemContainerElementType } from '../../types/editor-types';
import { HandlerFn } from './types';

export const enter: HandlerFn = ({ editor, event }) => {
  if (event.key === 'Enter' && containsVoid(editor, editor.selection)) {
    event.preventDefault();

    return;
  }

  if (event.shiftKey && event.key === 'Enter') {
    event.preventDefault();
    Transforms.insertText(editor, '\n');

    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    insertPageBreak(editor);

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
