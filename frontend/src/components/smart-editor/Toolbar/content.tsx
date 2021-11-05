import React from 'react';
import { useSlate } from 'slate-react';
import { ContentTypeEnum } from '../editor-types';
import { isBlockActive, toggleBlock } from './functions/blocks';
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
      icon={<BlockquoteIcon height={iconSize} />}
    />
  );
};
