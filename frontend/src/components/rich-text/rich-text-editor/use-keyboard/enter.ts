import { Editor, Path, Transforms } from 'slate';
import { createNewParagraph, getSelectedListTypes } from '../../functions/blocks';
import { containsVoid } from '../../functions/contains-void';
import { insertPageBreak } from '../../functions/insert-page-break';
import { ContentTypeEnum, ListContentEnum, ListTypesEnum } from '../../types/editor-enums';
import { isOfElementTypeFn, isOfElementTypesFn } from '../../types/editor-type-guards';
import { BulletListElementType, ListItemContainerElementType, NumberedListElementType } from '../../types/editor-types';
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

  if (
    getSelectedListTypes(editor)[ListTypesEnum.BULLET_LIST] ||
    getSelectedListTypes(editor)[ListTypesEnum.NUMBERED_LIST]
  ) {
    event.preventDefault();

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
      const [topListEntry] = Editor.nodes(editor, {
        match: isOfElementTypesFn<BulletListElementType | NumberedListElementType>([
          ListTypesEnum.BULLET_LIST,
          ListTypesEnum.NUMBERED_LIST,
        ]),
        mode: 'highest',
      });

      if (typeof topListEntry === 'undefined') {
        return;
      }

      const [topListNode, topListPath] = topListEntry;

      Editor.withoutNormalizing(editor, () => {
        const marks = Editor.marks(editor);

        const relativeDepth = path.length - topListPath.length;

        for (let i = 0; i < relativeDepth; i++) {
          Transforms.liftNodes(editor, { at: topListPath, match: (n) => n === element });
        }

        Transforms.setNodes(
          editor,
          { type: ContentTypeEnum.PARAGRAPH, indent: topListNode.indent },
          { at: Path.parent(topListPath), match: (n) => n === element }
        );

        editor.marks = marks;
      });

      return;
    }

    Transforms.splitNodes(editor, { always: true, match: isOfElementTypeFn(ListContentEnum.LIST_ITEM) });

    return;
  }

  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
    insertPageBreak(editor);
  }

  event.preventDefault();
  createNewParagraph(editor);
};
