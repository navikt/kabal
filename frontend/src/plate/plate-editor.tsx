import { PlateContainer, PlateContent, type PlateContentProps } from 'platejs/react';
import { merge } from '@/functions/classes';
import type { SpellCheckLanguage } from '@/hooks/use-smart-editor-language';

interface Props extends Omit<PlateContentProps, 'contentEditable'> {
  lang: SpellCheckLanguage;
}

export const KabalPlateEditor = ({ className, spellCheck = true, ...props }: Props) => (
  <PlateContainer>
    <PlateContent
      {...props}
      className={merge('min-h-full outline-none', className)}
      spellCheck={spellCheck}
      aria-label="Brevutforming"
      renderLeaf={({ attributes, children }) => <span {...attributes}>{children}</span>}
    />
  </PlateContainer>
);
