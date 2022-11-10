import { TextBulletListLtr } from '@styled-icons/fluentui-system-regular/TextBulletListLtr';
import { TextNumberListLtr } from '@styled-icons/fluentui-system-regular/TextNumberListLtr';
import React from 'react';
import { Editor, Path, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { ListContentEnum, ListTypesEnum } from '../../rich-text/types/editor-enums';
import { isOfElementType, isOfElementTypeFn } from '../../rich-text/types/editor-type-guards';
import { BulletListElementType, ListItemContainerElementType } from '../../rich-text/types/editor-types';
import { getSelectedListTypes } from '../functions/blocks';
import { isInPlaceholderInMaltekst } from '../functions/maltekst';
import { ToolbarIconButton } from './toolbarbutton';

interface ListsProps {
  iconSize: number;
}

export const Lists = ({ iconSize }: ListsProps) => {
  const editor = useSlate();

  const isBulletListActive = getSelectedListTypes(editor)[ListTypesEnum.BULLET_LIST];
  const isNumberedListActive = getSelectedListTypes(editor)[ListTypesEnum.NUMBERED_LIST];
  const notEditable = isInPlaceholderInMaltekst(editor);

  return (
    <>
      <ToolbarIconButton
        label="Punktliste"
        icon={<TextBulletListLtr width={iconSize} />}
        disabled={notEditable}
        onClick={() => {
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
                { mode: 'lowest', match: isOfElementTypeFn(ListTypesEnum.NUMBERED_LIST) }
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
        }}
        active={isBulletListActive}
      />
      <ToolbarIconButton
        label="Nummerliste"
        icon={<TextNumberListLtr width={iconSize} />}
        disabled={notEditable}
        onClick={() => {
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
                { mode: 'lowest', match: isOfElementTypeFn(ListTypesEnum.BULLET_LIST) }
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
        }}
        active={isNumberedListActive}
      />
    </>
  );
};
