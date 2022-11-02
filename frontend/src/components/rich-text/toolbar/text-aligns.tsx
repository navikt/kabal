import { TextAlignLeft } from '@styled-icons/fluentui-system-regular/TextAlignLeft';
import { TextAlignRight } from '@styled-icons/fluentui-system-regular/TextAlignRight';
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
        icon={<TextAlignLeft width={iconSize} />}
        onClick={() => setTextAlign(editor, TextAlignEnum.TEXT_ALIGN_LEFT)}
        active={isTextAlignActive(editor, TextAlignEnum.TEXT_ALIGN_LEFT)}
        disabled={disabled}
      />
      <ToolbarIconButton
        label="Høyrejuster"
        icon={<TextAlignRight width={iconSize} />}
        onClick={() => setTextAlign(editor, TextAlignEnum.TEXT_ALIGN_RIGHT)}
        active={isTextAlignActive(editor, TextAlignEnum.TEXT_ALIGN_RIGHT)}
        disabled={disabled}
      />
    </>
  );
};
