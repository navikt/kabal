import { TextBulletListLtr } from '@styled-icons/fluentui-system-regular/TextBulletListLtr';
import { TextNumberListLtr } from '@styled-icons/fluentui-system-regular/TextNumberListLtr';
import React from 'react';
import { useSlate } from 'slate-react';
import { ListTypesEnum } from '../../rich-text/types/editor-enums';
import { getSelectedListTypes } from '../functions/blocks';
import { insertBulletList, insertNumberedList } from '../functions/lists';
import { isInPlaceholderInMaltekst } from '../functions/maltekst';
import { ToolbarIconButton } from './toolbarbutton';

interface ListsProps {
  iconSize: number;
}

export const Lists = ({ iconSize }: ListsProps) => {
  const editor = useSlate();

  const isBulletListActive = getSelectedListTypes(editor)[ListTypesEnum.BULLET_LIST];
  const isNumberedListActive = getSelectedListTypes(editor)[ListTypesEnum.NUMBERED_LIST];
  const notEditable = isInPlaceholderInMaltekst(editor);

  return (
    <>
      <ToolbarIconButton
        label="Punktliste"
        icon={<TextBulletListLtr width={iconSize} />}
        disabled={notEditable}
        onClick={() => insertBulletList(editor)}
        active={isBulletListActive}
      />
      <ToolbarIconButton
        label="Nummerliste"
        icon={<TextNumberListLtr width={iconSize} />}
        disabled={notEditable}
        onClick={() => insertNumberedList(editor)}
        active={isNumberedListActive}
      />
    </>
  );
};
