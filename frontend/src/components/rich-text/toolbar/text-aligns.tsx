import { FormatAlignLeft } from '@styled-icons/material/FormatAlignLeft';
import { FormatAlignRight } from '@styled-icons/material/FormatAlignRight';
import React from 'react';
import { useSlate } from 'slate-react';
import { isTextAlignActive, setTextAlign } from '../functions/text-align';
import { TextAlignEnum } from '../types/editor-enums';
import { ToolbarIconButton } from './toolbarbutton';

interface TextAlignsProps {
  iconSize: number;
  disabled?: boolean;
}

export const TextAligns = ({ iconSize, disabled = true }: TextAlignsProps) => {
  const editor = useSlate();

  return (
    <>
      <ToolbarIconButton
        label="Venstrejuster"
        icon={<FormatAlignLeft width={iconSize} />}
        onClick={() => setTextAlign(editor, TextAlignEnum.TEXT_ALIGN_LEFT)}
        active={isTextAlignActive(editor, TextAlignEnum.TEXT_ALIGN_LEFT)}
        disabled={disabled}
      />
      <ToolbarIconButton
        label="Høyrejuster"
        icon={<FormatAlignRight width={iconSize} />}
        onClick={() => setTextAlign(editor, TextAlignEnum.TEXT_ALIGN_RIGHT)}
        active={isTextAlignActive(editor, TextAlignEnum.TEXT_ALIGN_RIGHT)}
        disabled={disabled}
      />
    </>
  );
};
