import React from 'react';
import { useSlate } from 'slate-react';
import { areBlocksActive, isBlockActive, toggleBlock } from '../functions/blocks';
import { ContentTypeEnum, ListContentEnum } from '../types/editor-enums';
import { BlockquoteIcon } from './icons/blockquote';
import { ToolbarIconButton } from './toolbarbutton';

interface ContentProps {
  iconSize: number;
  display?: boolean;
}

export const Content = ({ iconSize, display = true }: ContentProps) => {
  const editor = useSlate();

  if (!display) {
    return null;
  }

  return (
    <ToolbarIconButton
      label="Blockquote"
      onClick={() => toggleBlock(editor, ContentTypeEnum.BLOCKQUOTE)}
      active={isBlockActive(editor, ContentTypeEnum.BLOCKQUOTE)}
      disabled={areBlocksActive(editor, [ListContentEnum.LIST_ITEM_CONTAINER])}
      icon={<BlockquoteIcon height={iconSize} />}
    />
  );
};
