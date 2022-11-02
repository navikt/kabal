import { TextBold } from '@styled-icons/fluentui-system-regular/TextBold';
import { TextItalic } from '@styled-icons/fluentui-system-regular/TextItalic';
import { TextUnderline } from '@styled-icons/fluentui-system-regular/TextUnderline';
import React from 'react';
import { useSlateStatic } from 'slate-react';
import { MarkKeys } from '../../rich-text/types/marks';
import { isMarkActive, toggleMark } from '../functions/marks';
import { ToolbarIconButton } from './toolbarbutton';

interface MarksProps {
  iconSize: number;
  disabled?: boolean;
}

export const Marks = ({ iconSize, disabled = true }: MarksProps) => {
  const editor = useSlateStatic();

  return (
    <>
      <ToolbarIconButton
        label="Fet skrift (Ctrl/⌘ + B)"
        onClick={() => toggleMark(editor, MarkKeys.bold)}
        active={isMarkActive(editor, MarkKeys.bold) && !disabled}
        icon={<TextBold width={iconSize} />}
        disabled={disabled}
      />
      <ToolbarIconButton
        label="Kursiv (Ctrl/⌘ + I)"
        onClick={() => toggleMark(editor, MarkKeys.italic)}
        active={isMarkActive(editor, MarkKeys.italic) && !disabled}
        icon={<TextItalic width={iconSize} />}
        disabled={disabled}
      />
      <ToolbarIconButton
        label="Understreking (Ctrl/⌘ + U)"
        onClick={() => toggleMark(editor, MarkKeys.underline)}
        active={isMarkActive(editor, MarkKeys.underline) && !disabled}
        icon={<TextUnderline width={iconSize} />}
        disabled={disabled}
      />
    </>
  );
};
