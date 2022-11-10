import { TextIndentDecreaseLtr } from '@styled-icons/fluentui-system-regular/TextIndentDecreaseLtr';
import { TextIndentIncreaseLtr } from '@styled-icons/fluentui-system-regular/TextIndentIncreaseLtr';
import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { MAX_INDENT } from '../../smart-editor/constants';
import { decreaseIndent, increaseIndent } from '../functions/indent';
import { isInMaltekst } from '../functions/maltekst';
import { ContentTypeEnum, ListTypesEnum } from '../types/editor-enums';
import { isOfElementTypesFn } from '../types/editor-type-guards';
import { BulletListElementType, NumberedListElementType, ParagraphElementType } from '../types/editor-types';
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

  const notEditable = isInMaltekst(editor);

  const elementEntries = Editor.nodes(editor, {
    match: isOfElementTypesFn<ParagraphElementType | BulletListElementType | NumberedListElementType>([
      ContentTypeEnum.PARAGRAPH,
      ListTypesEnum.BULLET_LIST,
      ListTypesEnum.NUMBERED_LIST,
    ]),
    mode: 'highest',
  });

  const elements = Array.from(elementEntries);

  const isIndentable = elements.some(([node]) => (node.indent ?? 0) < MAX_INDENT);
  const isUnindentable = elements.some(([node]) => (node.indent ?? 0) > 0);

  return (
    <>
      <ToolbarIconButton
        label="Innrykk"
        onClick={() => increaseIndent(editor)}
        active={isUnindentable}
        disabled={notEditable || !isIndentable}
        icon={<TextIndentIncreaseLtr height={iconSize} />}
      />

      <ToolbarIconButton
        label="Fjern innrykk"
        onClick={() => decreaseIndent(editor)}
        disabled={notEditable || !isUnindentable}
        icon={<TextIndentDecreaseLtr height={iconSize} />}
        active={false}
      />
    </>
  );
};
