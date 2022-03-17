import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Utfall } from '../../../../types/kodeverk';
import { IOppgavebehandling } from '../../../../types/oppgavebehandling';
import { ISectionTitleElement } from '../../../../types/smart-editor';

interface Props {
  oppgave: IOppgavebehandling;
  element: ISectionTitleElement;
  onChange: (value: string, element: ISectionTitleElement) => void;
}

export const SectionTitleElement = React.memo(
  ({ oppgave, element, onChange }: Props) => {
    const content = getContent(oppgave, element);

    useEffect(() => {
      if (element.content !== content) {
        onChange(content, element);
      }
    }, [content, element, onChange]);

    return <StyledTitle>{content}</StyledTitle>;
  },
  (prevProps, nextProps) =>
    prevProps.element.id === nextProps.element.id &&
    prevProps.element.type === nextProps.element.type &&
    prevProps.element.content === nextProps.element.content
);

SectionTitleElement.displayName = 'SectionTitleElement';

const getContent = (oppgave: IOppgavebehandling, { source, content }: ISectionTitleElement): string => {
  if (typeof source === 'string' && source === 'utfall-title') {
    if (
      oppgave.resultat.utfall === Utfall.OPPHEVET ||
      oppgave.resultat.utfall === Utfall.TRUKKET ||
      oppgave.resultat.utfall === Utfall.RETUR ||
      oppgave.resultat.utfall === Utfall.UGUNST
    ) {
      return 'Beslutning';
    }

    return 'Vedtak';
  }

  return content ?? source ?? '<verdi mangler>';
};

const StyledTitle = styled.h1`
  font-size: 22px;
  padding-left: 16px;
  margin-top: 16px;
  margin-bottom: 0;
`;
