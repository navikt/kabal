import { PlateElement, PlateRenderElementProps } from '@udecode/plate-common';
import { setNodes } from '@udecode/slate';
import { useCallback, useEffect, useState } from 'react';
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
  const [_result, setResult] = useState<string | null>(null);

  const setResultInNode = useCallback(
    (result: string | null) => setNodes(editor, { result }, { at: [], match: (n) => n === element }),
    [editor, element],
  );

  useEffect(() => {
    if (typeof oppgave === 'undefined') {
      return;
    }

    const content = getContent(oppgave, element.source);

    setResult(content);
    setResultInNode(content);
  }, [editor, element, element.label, element.source, oppgave, _result, setResultInNode]);

  if (typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      contentEditable={false}
      onDragStart={(event) => event.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <span>
        {_result === null ? null : (
          <StyledLabelContent>
            <b>{element.label}</b>: {_result}
          </StyledLabelContent>
        )}
        {children}
      </span>
    </PlateElement>
  );
};

const getContent = (oppgave: IOppgavebehandling, source: string): string | null => {
  if (source === 'sakenGjelder.name') {
    return `${oppgave.sakenGjelder.name}\n` ?? '-\n';
  }

  if (source === 'sakenGjelder.fnr') {
    return `${formatFoedselsnummer(oppgave.sakenGjelder.id)}\n`;
  }

  if (source === 'saksnummer') {
    return oppgave.saksnummer;
  }

  const { klager, sakenGjelder } = oppgave;

  if (source === 'sakenGjelderIfDifferentFromKlager.name') {
    if (klager.id !== sakenGjelder.id) {
      return `${sakenGjelder.name}\n` ?? '-\n';
    }

    return null;
  }

  if (source === 'klagerIfEqualToSakenGjelder.name') {
    if (klager.id === sakenGjelder.id) {
      return `${klager.name}\n` ?? '-\n';
    }

    return null;
  }

  if (source === 'klagerIfDifferentFromSakenGjelder.name') {
    if (klager.id !== sakenGjelder.id) {
      return `${klager.name}\n` ?? '-\n';
    }

    return null;
  }

  if (source === 'klager.name') {
    return `${klager.name}\n` ?? '-\n';
  }

  return 'Verdi mangler\n';
};

const StyledLabelContent = styled.span`
  color: var(--a-gray-700);
`;
