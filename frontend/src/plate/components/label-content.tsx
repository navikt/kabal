import { PlateElement, PlateRenderElementProps } from '@udecode/plate-common';
import { setNodes } from '@udecode/slate';
import React, { useEffect, useState } from 'react';
import { useSelected } from 'slate-react';
import { styled } from 'styled-components';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { EditorValue, LabelContentElement, TextAlign } from '@app/plate/types';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

export const LabelContent = ({
  element,
  attributes,
  children,
  editor,
}: PlateRenderElementProps<EditorValue, LabelContentElement>) => {
  const { data: oppgave } = useOppgave();
  const [result, setResult] = useState<string | null>(null);
  const isSelected = useSelected();

  useEffect(() => {
    if (result === null) {
      return;
    }

    setNodes(editor, { result }, { at: [], match: (n) => n === element });
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
    <PlateElement as="div" attributes={attributes} element={element} editor={editor} contentEditable={false}>
      <VoidParagraphStyle $isFocused={isSelected} $textAlign={TextAlign.LEFT}>
        {result}
      </VoidParagraphStyle>
      {children}
    </PlateElement>
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

const VoidParagraphStyle = styled.p<{ $isFocused: boolean; $textAlign: TextAlign }>`
  color: var(--a-text-subtle);
  border-radius: 2px;
  transition:
    background-color 0.2s ease-in-out,
    outline-color 0.2s ease-in-out;
  background-color: ${({ $isFocused }) => ($isFocused ? 'var(--a-gray-700)' : 'transparent')};
  outline-color: ${({ $isFocused }) => ($isFocused ? 'var(--a-gray-700)' : 'transparent')};
  text-align: ${({ $textAlign }) => $textAlign};
`;
