import { Notes } from '@styled-icons/material/Notes';
import React from 'react';
import { useSlate } from 'slate-react';
import { areBlocksActive, isBlockActive, toggleBlock } from '../functions/blocks';
import { ContentTypeEnum, HeadingTypesEnum, ListContentEnum } from '../types/editor-enums';
import { ToolbarIconButton, ToolbarTextButton } from './toolbarbutton';

interface Props {
  iconSize: number;
}

export const Headings = ({ iconSize }: Props) => {
  const editor = useSlate();

  return (
    <>
      <ToolbarIconButton
        label="Normal tekst"
        icon={<Notes width={iconSize} />}
        onClick={() => toggleBlock(editor, ContentTypeEnum.PARAGRAPH)}
        active={isBlockActive(editor, ContentTypeEnum.PARAGRAPH)}
        disabled={areBlocksActive(editor, [ListContentEnum.LIST_ITEM_CONTAINER])}
      />
      <ToolbarTextButton
        label="Dokumenttittel"
        text="H"
        fontWeight={600}
        onClick={() => toggleBlock(editor, HeadingTypesEnum.HEADING_ONE)}
        active={isBlockActive(editor, HeadingTypesEnum.HEADING_ONE)}
        disabled={areBlocksActive(editor, [ListContentEnum.LIST_ITEM_CONTAINER])}
      />
      <ToolbarTextButton
        label="Tittel nivå 1"
        text="H1"
        fontWeight={600}
        onClick={() => toggleBlock(editor, HeadingTypesEnum.HEADING_TWO)}
        active={isBlockActive(editor, HeadingTypesEnum.HEADING_TWO)}
        disabled={areBlocksActive(editor, [ListContentEnum.LIST_ITEM_CONTAINER])}
      />
      <ToolbarTextButton
        label="Tittel nivå 2"
        text="H2"
        fontWeight={600}
        onClick={() => toggleBlock(editor, HeadingTypesEnum.HEADING_THREE)}
        active={isBlockActive(editor, HeadingTypesEnum.HEADING_THREE)}
        disabled={areBlocksActive(editor, [ListContentEnum.LIST_ITEM_CONTAINER])}
      />
      <ToolbarTextButton
        label="Tittel nivå 3"
        text="H3"
        fontWeight={600}
        onClick={() => toggleBlock(editor, HeadingTypesEnum.HEADING_FOUR)}
        active={isBlockActive(editor, HeadingTypesEnum.HEADING_FOUR)}
        disabled={areBlocksActive(editor, [ListContentEnum.LIST_ITEM_CONTAINER])}
      />
    </>
  );
};