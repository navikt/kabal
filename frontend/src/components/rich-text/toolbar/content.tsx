import { FormatIndentDecrease } from '@styled-icons/material/FormatIndentDecrease';
import { FormatIndentIncrease } from '@styled-icons/material/FormatIndentIncrease';
import React from 'react';
import { useSlate } from 'slate-react';
import { isBlockActive } from '../functions/blocks';
import { decreaseIndent, increaseIndent } from '../functions/indent';
import { ContentTypeEnum } from '../types/editor-enums';
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
    <>
      <ToolbarIconButton
        label="Innrykk"
        onClick={() => increaseIndent(editor)}
        active={isBlockActive(editor, ContentTypeEnum.INDENT)}
        disabled={false}
        icon={<FormatIndentIncrease height={iconSize} />}
      />

      <ToolbarIconButton
        label="Fjern innrykk"
        onClick={() => decreaseIndent(editor)}
        disabled={!isBlockActive(editor, ContentTypeEnum.INDENT)}
        icon={<FormatIndentDecrease height={iconSize} />}
        active={false}
      />
    </>
  );
};
