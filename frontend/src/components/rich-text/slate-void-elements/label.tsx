import React, { useEffect, useState } from 'react';
import { Transforms } from 'slate';
import { useSelected, useSlateStatic } from 'slate-react';
import { styled } from 'styled-components';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { RenderElementProps } from '../slate-elements/render-props';
import { ParagraphStyle } from '../styled-elements/content';
import { TextAlignEnum } from '../types/editor-enums';
import { LabelContentElementType } from '../types/editor-void-types';
import { voidStyle } from './style';

export const LabelElement = ({ element, attributes, children }: RenderElementProps<LabelContentElementType>) => {
  const editor = useSlateStatic();
  const { data: oppgave } = useOppgave();
  const [result, setResult] = useState<string | null>(null);
  const isSelected = useSelected();

  useEffect(() => {
    if (result === null) {
      return;
    }

    Transforms.setNodes<LabelContentElementType>(editor, { result }, { at: [], match: (n) => n === element });
  }, [editor, element, result]);

  useEffect(() => {
    if (typeof oppgave === 'undefined') {
      return;
    }

    const content = getContent(oppgave, element.source);

    if (element.label.length === 0) {
      setResult(content);
    } else {
      setResult(`${element.label}: ${content}`);
    }
  }, [element.label, element.source, oppgave]);

  if (typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <div {...attributes} contentEditable={false}>
      <VoidParagraphStyle $isFocused={isSelected} textAlign={TextAlignEnum.TEXT_ALIGN_LEFT}>
        {result}
      </VoidParagraphStyle>
      {children}
    </div>
  );
};

const getContent = (oppgave: IOppgavebehandling, source: string): string => {
  if (source === 'sakenGjelder.name') {
    return oppgave.sakenGjelder.name ?? '-';
  }

  if (source === 'sakenGjelder.fnr') {
    return formatFoedselsnummer(oppgave.sakenGjelder.id);
  }

  return 'Verdi mangler';
};

const VoidParagraphStyle = styled(ParagraphStyle)<{ $isFocused: boolean }>`
  ${voidStyle}
  border-radius: 2px;
  transition:
    background-color 0.2s ease-in-out,
    outline-color 0.2s ease-in-out;
  background-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
  outline-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
`;
