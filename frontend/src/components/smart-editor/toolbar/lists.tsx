import { FormatListBulleted } from '@styled-icons/material/FormatListBulleted';
import { FormatListNumbered } from '@styled-icons/material/FormatListNumbered';
import React from 'react';
import { Editor, Element, Path, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { ListContentEnum, ListTypesEnum } from '../editor-enums';
import { isOfElementType } from '../editor-type-guards';
import { BulletListElementType, ListItemContainerElementType, NumberedListElementType } from '../editor-types';
import { getSelectedListTypes } from './functions/blocks';
import { ToolbarIconButton } from './toolbarbutton';

interface ListsProps {
  iconSize: number;
}

export const Lists = ({ iconSize }: ListsProps) => {
  const editor = useSlate();

  const isBulletListActive = getSelectedListTypes(editor)[ListTypesEnum.BULLET_LIST];
  const isNumberedListActive = getSelectedListTypes(editor)[ListTypesEnum.NUMBERED_LIST];

  return (
    <>
      <ToolbarIconButton
        label="Punktliste"
        icon={<FormatListBulleted width={iconSize} />}
        onClick={() => {
          Editor.withoutNormalizing(editor, () => {
            if (isBulletListActive && isNumberedListActive) {
              const listItemContainers = Editor.nodes<ListItemContainerElementType>(editor, {
                match: (n) => isOfElementType(n, ListContentEnum.LIST_ITEM_CONTAINER),
                mode: 'lowest',
              });

              for (const [, licPath] of listItemContainers) {
                const [parent, at] = Editor.parent(editor, Path.parent(licPath));

                if (isOfElementType<BulletListElementType>(parent, ListTypesEnum.BULLET_LIST)) {
                  Transforms.setNodes(
                    editor,
                    { type: ListTypesEnum.NUMBERED_LIST },
                    {
                      at,
                    }
                  );
                }
              }

              return;
            }

            if (isNumberedListActive) {
              Transforms.setNodes(
                editor,
                { type: ListTypesEnum.BULLET_LIST },
                {
                  mode: 'lowest',
                  match: (n) => isOfElementType<NumberedListElementType>(n, ListTypesEnum.NUMBERED_LIST),
                }
              );
              return;
            }

            if (isBulletListActive) {
              return;
            }

            Transforms.setNodes(editor, { type: ListContentEnum.LIST_ITEM_CONTAINER });
            Transforms.wrapNodes(editor, { type: ListTypesEnum.BULLET_LIST, children: [] });
            Transforms.wrapNodes(editor, { type: ListContentEnum.LIST_ITEM, children: [] });
          });
        }}
        active={isBulletListActive}
      />
      <ToolbarIconButton
        label="Nummerliste"
        icon={<FormatListNumbered width={iconSize} />}
        onClick={() => {
          Editor.withoutNormalizing(editor, () => {
            if (isBulletListActive && isNumberedListActive) {
              const listItemContainers = Editor.nodes<ListItemContainerElementType>(editor, {
                match: (n) => isOfElementType(n, ListContentEnum.LIST_ITEM_CONTAINER),
                mode: 'lowest',
              });

              for (const [, licPath] of listItemContainers) {
                const [parent, at] = Editor.parent(editor, Path.parent(licPath));

                if (isOfElementType<BulletListElementType>(parent, ListTypesEnum.NUMBERED_LIST)) {
                  Transforms.setNodes(
                    editor,
                    { type: ListTypesEnum.BULLET_LIST },
                    {
                      at,
                    }
                  );
                }
              }

              return;
            }

            if (isBulletListActive) {
              Transforms.setNodes(
                editor,
                { type: ListTypesEnum.NUMBERED_LIST },
                {
                  mode: 'lowest',
                  match: (n) => Element.isElement(n) && n.type === ListTypesEnum.BULLET_LIST,
                }
              );
              return;
            }

            if (isNumberedListActive) {
              return;
            }

            Transforms.setNodes(editor, { type: ListContentEnum.LIST_ITEM_CONTAINER });
            Transforms.wrapNodes(editor, { type: ListTypesEnum.NUMBERED_LIST, children: [] });
            Transforms.wrapNodes(editor, { type: ListContentEnum.LIST_ITEM, children: [] });
          });
        }}
        active={isNumberedListActive}
      />
    </>
  );
};
