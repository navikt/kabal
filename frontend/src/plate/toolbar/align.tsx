import { TextAlignLeft, TextAlignRight } from '@styled-icons/fluentui-system-regular';
import { setAlign, useAlignDropdownMenuState } from '@udecode/plate-alignment';
import React from 'react';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useIsInList } from '@app/plate/toolbar/use-is-in-list';
import { useMyPlateEditorRef } from '@app/plate/types';
import { useIsInHeading } from './use-is-in-heading';

export const Align = () => {
  const editor = useMyPlateEditorRef();
  const { value } = useAlignDropdownMenuState();
  const unchangeable = useIsUnchangeable();
  const isInList = useIsInList();
  const isInHeading = useIsInHeading();

  const disabled = unchangeable || isInList || isInHeading;

  return (
    <>
      <ToolbarIconButton
        label="Venstrejuster"
        onClick={() => setAlign(editor, { value: 'left' })}
        icon={<TextAlignLeft aria-hidden width={24} />}
        active={value === 'left'}
        disabled={disabled}
      />
      <ToolbarIconButton
        label="Høyrejuster"
        onClick={() => setAlign(editor, { value: 'right' })}
        icon={<TextAlignRight aria-hidden width={24} />}
        active={value === 'right'}
        disabled={disabled}
      />
    </>
  );
};
