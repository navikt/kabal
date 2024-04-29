import { PlateContent, PlateContentProps } from '@udecode/plate-common';
import React from 'react';
import { SpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { renderLeaf as defaultRenderLeaf, renderReadOnlyLeaf } from '@app/plate/leaf/render-leaf';

interface Props extends PlateContentProps {
  lang: SpellCheckLanguage;
}

export const PlateEditor = ({
  readOnly = false,
  renderLeaf = defaultRenderLeaf,
  className,
  spellCheck = true,
  ...props
}: Props) => (
  <PlateContent
    {...props}
    className={className === undefined ? 'smart-editor' : `smart-editor ${className}`}
    spellCheck={spellCheck}
    renderLeaf={readOnly ? renderReadOnlyLeaf : renderLeaf}
  />
);
