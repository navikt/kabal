import { Editor, Path, Transforms } from 'slate';
import { ListContentEnum, ListTypesEnum } from '../types/editor-enums';
import { isOfElementType, isOfElementTypeFn } from '../types/editor-type-guards';
import { BulletListElementType, ListItemContainerElementType } from '../types/editor-types';
import { getSelectedListTypes } from './blocks';

export const insertBulletList = (editor: Editor) => {
  const isBulletListActive = getSelectedListTypes(editor)[ListTypesEnum.BULLET_LIST];
  const isNumberedListActive = getSelectedListTypes(editor)[ListTypesEnum.NUMBERED_LIST];

  Editor.withoutNormalizing(editor, () => {
    if (isBulletListActive && isNumberedListActive) {
      const listItemContainers = Editor.nodes<ListItemContainerElementType>(editor, {
        match: isOfElementTypeFn(ListContentEnum.LIST_ITEM_CONTAINER),
        mode: 'lowest',
      });

      for (const [, licPath] of listItemContainers) {
        const [parent, at] = Editor.parent(editor, Path.parent(licPath));

        if (isOfElementType<BulletListElementType>(parent, ListTypesEnum.BULLET_LIST)) {
          Transforms.setNodes(editor, { type: ListTypesEnum.NUMBERED_LIST, indent: 0 }, { at });
        }
      }

      return;
    }

    if (isNumberedListActive) {
      Transforms.setNodes(
        editor,
        { type: ListTypesEnum.BULLET_LIST },
        { mode: 'lowest', match: isOfElementTypeFn(ListTypesEnum.NUMBERED_LIST) },
      );

      return;
    }

    if (isBulletListActive) {
      return;
    }

    Transforms.setNodes(editor, { type: ListContentEnum.LIST_ITEM_CONTAINER });
    Transforms.wrapNodes(editor, { type: ListTypesEnum.BULLET_LIST, children: [], indent: 0 });
    Transforms.wrapNodes(editor, { type: ListContentEnum.LIST_ITEM, children: [] });
  });
};

export const insertNumberedList = (editor: Editor) => {
  const isBulletListActive = getSelectedListTypes(editor)[ListTypesEnum.BULLET_LIST];
  const isNumberedListActive = getSelectedListTypes(editor)[ListTypesEnum.NUMBERED_LIST];

  Editor.withoutNormalizing(editor, () => {
    if (isBulletListActive && isNumberedListActive) {
      const listItemContainers = Editor.nodes<ListItemContainerElementType>(editor, {
        match: isOfElementTypeFn(ListContentEnum.LIST_ITEM_CONTAINER),
        mode: 'lowest',
      });

      for (const [, licPath] of listItemContainers) {
        const [parent, at] = Editor.parent(editor, Path.parent(licPath));

        if (isOfElementType<BulletListElementType>(parent, ListTypesEnum.NUMBERED_LIST)) {
          Transforms.setNodes(editor, { type: ListTypesEnum.BULLET_LIST }, { at });
        }
      }

      return;
    }

    if (isBulletListActive) {
      Transforms.setNodes(
        editor,
        { type: ListTypesEnum.NUMBERED_LIST },
        { mode: 'lowest', match: isOfElementTypeFn(ListTypesEnum.BULLET_LIST) },
      );

      return;
    }

    if (isNumberedListActive) {
      return;
    }

    Transforms.setNodes(editor, { type: ListContentEnum.LIST_ITEM_CONTAINER });
    Transforms.wrapNodes(editor, { type: ListTypesEnum.NUMBERED_LIST, children: [], indent: 0 });
    Transforms.wrapNodes(editor, { type: ListContentEnum.LIST_ITEM, children: [] });
  });
};
