import { PlateElement, PlateRenderElementProps } from '@udecode/plate-common';
import { setNodes } from '@udecode/slate';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { EditorValue, LabelContentElement } from '@app/plate/types';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

export const LabelContent = ({
  element,
  attributes,
  children,
  editor,
}: PlateRenderElementProps<EditorValue, LabelContentElement>) => {
  const { data: oppgave } = useOppgave();
  const [result, setResult] = useState<string | null>(null);

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
    <PlateElement asChild attributes={attributes} element={element} editor={editor} contentEditable={false}>
      <span>
        <StyledLabelContent>{result}</StyledLabelContent>
        {children}
      </span>
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

  if (source === 'saksnummer') {
    return oppgave.saksnummer;
  }

  return 'Verdi mangler';
};

const StyledLabelContent = styled.span`
  color: var(--a-gray-700);
`;
