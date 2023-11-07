import { PlateContent, PlateContentProps } from '@udecode/plate-common';
import React from 'react';
import { renderLeaf as defaultRenderLeaf, renderReadOnlyLeaf } from '@app/plate/leaf/render-leaf';

export const PlateEditor = ({
  readOnly = false,
  renderLeaf = defaultRenderLeaf,
  className,
  spellCheck = true,
  ...props
}: PlateContentProps) => (
  <PlateContent
    {...props}
    className={className === undefined ? 'smart-editor' : `smart-editor ${className}`}
    spellCheck={spellCheck}
    renderLeaf={readOnly ? renderReadOnlyLeaf : renderLeaf}
  />
);
