import React, { useEffect } from 'react';
import styled from 'styled-components';
import { getFullName } from '../../../../domain/name';
import { formatPersonNum } from '../../../../functions/format-id';
import { IOppgavebehandling } from '../../../../types/oppgavebehandling';
import { ILabelContentElement } from '../../../../types/smart-editor';

interface Props {
  oppgave: IOppgavebehandling;
  element: ILabelContentElement;
  onChange: (value: string, element: ILabelContentElement) => void;
}

export const DynamicElement = React.memo(
  ({ oppgave, element, onChange }: Props) => {
    const content = getContent(oppgave, element.source);

    useEffect(() => {
      if (element.content !== content) {
        onChange(content, element);
      }
    }, [content, element, onChange]);

    if (element.label.length === 0) {
      return <DynamicContent>{content}</DynamicContent>;
    }

    return (
      <DynamicContent>
        {element.label}: {content}
      </DynamicContent>
    );
  },
  (prevProps, nextProps) =>
    prevProps.element.id === nextProps.element.id &&
    prevProps.element.type === nextProps.element.type &&
    prevProps.element.source === nextProps.element.source &&
    prevProps.element.label === nextProps.element.label &&
    prevProps.element.content === nextProps.element.content
);

DynamicElement.displayName = 'DynamicElement';

const getContent = (oppgave: IOppgavebehandling, source: string): string => {
  if (source === 'sakenGjelder.name') {
    return getFullName(oppgave.sakenGjelder.person?.navn);
  }

  if (source === 'sakenGjelder.fnr') {
    return formatPersonNum(oppgave.sakenGjelder.person?.foedselsnummer);
  }

  return 'Verdi mangler';
};

const DynamicContent = styled.p`
  padding-left: 16px;
  margin-top: 16px;
  margin-bottom: 0;
`;
