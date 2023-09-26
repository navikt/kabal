import { PlateElement, PlateRenderElementProps } from '@udecode/plate-common';
import { setNodes } from '@udecode/slate';
import React, { useEffect, useState } from 'react';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { SectionContainer, SectionTypeEnum } from '@app/plate/components/section-container';
import { EditorValue, LabelContentElement } from '@app/plate/types';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { StyledParagraph } from './paragraph';

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
      <SectionContainer
        sectionType={SectionTypeEnum.LABEL}
        menu={{
          title: 'Fra saken',
          items: <AddNewParagraphs editor={editor} element={element} />,
        }}
      >
        <StyledParagraph $isEmpty={result === null}>{result}</StyledParagraph>
        {children}
      </SectionContainer>
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
