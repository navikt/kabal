import { PlateElement, PlateRenderElementProps } from '@udecode/plate-common';
import { setNodes } from '@udecode/slate';
import React, { useEffect, useState } from 'react';
import { useSelected } from 'slate-react';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { EditorValue, LabelContentElement } from '@app/plate/types';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { StyledParagraph } from './paragraph';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from './styled-components';

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
    <PlateElement asChild attributes={attributes} element={element} editor={editor} contentEditable={false}>
      <SectionContainer $isSelected={isSelected} $sectionType={SectionTypeEnum.LABEL}>
        <StyledParagraph $isEmpty={result === null}>{result}</StyledParagraph>
        {children}
        <SectionToolbar contentEditable={false} $sectionType={SectionTypeEnum.LABEL} $label="Fra saken">
          <AddNewParagraphs editor={editor} element={element} />
        </SectionToolbar>
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
