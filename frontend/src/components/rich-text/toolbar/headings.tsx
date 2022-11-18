import { TextDescription } from '@styled-icons/fluentui-system-regular/TextDescription';
import { TextHeader1 } from '@styled-icons/fluentui-system-regular/TextHeader1';
import { TextHeader2 } from '@styled-icons/fluentui-system-regular/TextHeader2';
import { TextHeader3 } from '@styled-icons/fluentui-system-regular/TextHeader3';
import React from 'react';
import { useSlate } from 'slate-react';
import { areBlocksActive, isBlockActive, toggleBlock } from '../functions/blocks';
import { isInPlaceholderInMaltekst } from '../functions/maltekst';
import { ContentTypeEnum, HeadingTypesEnum, ListContentEnum, TableTypeEnum } from '../types/editor-enums';
import { ToolbarIconButton } from './toolbarbutton';

interface Props {
  iconSize: number;
}

export const Headings = ({ iconSize }: Props) => {
  const editor = useSlate();

  const notEditable = isInPlaceholderInMaltekst(editor);
  const disabled = areBlocksActive(editor, [ListContentEnum.LIST_ITEM_CONTAINER, TableTypeEnum.TABLE]) || notEditable;

  return (
    <>
      <ToolbarIconButton
        label="Normal tekst"
        icon={<TextDescription width={iconSize} />}
        onClick={() => toggleBlock(editor, ContentTypeEnum.PARAGRAPH)}
        active={isBlockActive(editor, ContentTypeEnum.PARAGRAPH)}
        disabled={disabled}
      />
      <ToolbarIconButton
        label="Dokumenttittel / Overskrift 1"
        icon={<TextHeader1 width={iconSize} />}
        fontWeight={600}
        onClick={() => toggleBlock(editor, HeadingTypesEnum.HEADING_ONE)}
        active={isBlockActive(editor, HeadingTypesEnum.HEADING_ONE)}
        disabled={disabled}
      />
      <ToolbarIconButton
        label="Overskrift 2"
        icon={<TextHeader2 width={iconSize} />}
        fontWeight={600}
        onClick={() => toggleBlock(editor, HeadingTypesEnum.HEADING_TWO)}
        active={isBlockActive(editor, HeadingTypesEnum.HEADING_TWO)}
        disabled={disabled}
      />
      <ToolbarIconButton
        label="Overskrift 3"
        icon={<TextHeader3 width={iconSize} />}
        fontWeight={600}
        onClick={() => toggleBlock(editor, HeadingTypesEnum.HEADING_THREE)}
        active={isBlockActive(editor, HeadingTypesEnum.HEADING_THREE)}
        disabled={disabled}
      />
    </>
  );
};
