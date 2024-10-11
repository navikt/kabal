import type { SpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { renderLeaf as defaultRenderLeaf } from '@app/plate/leaf/render-leaf';
import { PlateContent, type PlateContentProps } from '@udecode/plate-common';

interface Props extends PlateContentProps {
  lang: SpellCheckLanguage;
}

export const PlateEditor = ({ renderLeaf = defaultRenderLeaf, className, spellCheck = true, ...props }: Props) => (
  <PlateContent
    {...props}
    className={className === undefined ? 'smart-editor' : `smart-editor ${className}`}
    spellCheck={spellCheck}
    renderLeaf={renderLeaf}
  />
);
