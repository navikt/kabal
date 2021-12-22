import { FormatListBulleted } from '@styled-icons/material/FormatListBulleted';
import { FormatListNumbered } from '@styled-icons/material/FormatListNumbered';
import React from 'react';
import { Editor, Element, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { ContentTypeEnum, ListTypesEnum, NumberedListElementType, isOfElementType } from '../editor-types';
import { isBlockActive } from './functions/blocks';
import { ToolbarIconButton } from './toolbarbutton';

interface ListsProps {
  iconSize: number;
}

export const Lists = ({ iconSize }: ListsProps) => {
  const editor = useSlate();

  const isBulletListActive = isBlockActive(editor, ListTypesEnum.BULLET_LIST);
  const isNumberedListActive = isBlockActive(editor, ListTypesEnum.NUMBERED_LIST);

  return (
    <>
      <ToolbarIconButton
        label="Punktliste"
        icon={<FormatListBulleted width={iconSize} />}
        onClick={() => {
          Editor.withoutNormalizing(editor, () => {
            if (isNumberedListActive) {
              Transforms.setNodes(
                editor,
                { type: ListTypesEnum.BULLET_LIST },
                {
                  match: (n) => isOfElementType<NumberedListElementType>(n, ListTypesEnum.NUMBERED_LIST),
                }
              );
              return;
            }

            if (isBulletListActive) {
              Editor.withoutNormalizing(editor, () => {
                Transforms.liftNodes(editor);
                Transforms.setNodes(editor, { type: ContentTypeEnum.PARAGRAPH });
              });
              return;
            }

            Editor.withoutNormalizing(editor, () => {
              Transforms.setNodes(editor, { type: ListTypesEnum.LIST_ITEM });
              Transforms.wrapNodes(editor, { type: ListTypesEnum.BULLET_LIST, children: [] });
            });
          });
        }}
        active={isBulletListActive}
      />
      <ToolbarIconButton
        label="Nummerliste"
        icon={<FormatListNumbered width={iconSize} />}
        onClick={() => {
          Editor.withoutNormalizing(editor, () => {
            if (isBulletListActive) {
              Transforms.setNodes(
                editor,
                { type: ListTypesEnum.NUMBERED_LIST },
                { match: (n) => Element.isElement(n) && n.type === ListTypesEnum.BULLET_LIST }
              );
              return;
            }

            if (isNumberedListActive) {
              Editor.withoutNormalizing(editor, () => {
                Transforms.liftNodes(editor);
                Transforms.setNodes(editor, { type: ContentTypeEnum.PARAGRAPH });
              });
              return;
            }

            Editor.withoutNormalizing(editor, () => {
              Transforms.setNodes(editor, { type: ListTypesEnum.LIST_ITEM });
              Transforms.wrapNodes(editor, { type: ListTypesEnum.NUMBERED_LIST, children: [] });
            });
          });
        }}
        active={isNumberedListActive}
      />
    </>
  );
};
