import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { IOppgavebehandling } from '../../../../types/oppgavebehandling/oppgavebehandling';
import { IMedunderskriverResponse } from '../../../../types/oppgavebehandling/response';
import { getTitleCapitalized } from './getTitle';

type MedunderskriverInfoProps = Pick<IOppgavebehandling, 'tildeltSaksbehandler' | 'type'> &
  Pick<IMedunderskriverResponse, 'medunderskriver'>;

export const MedunderskriverInfo = ({ tildeltSaksbehandler, medunderskriver, type }: MedunderskriverInfoProps) => {
  const canEdit = useCanEdit();

  if (!canEdit) {
    const title = getTitleCapitalized(type);

    return (
      <div data-testid="medunderskriver-info">
        <StyledInfoLine>
          <b>Saksbehandler:</b> {tildeltSaksbehandler?.navn ?? 'Ikke tildelt'}
        </StyledInfoLine>
        <StyledInfoLine>
          <b>{title}:</b> {medunderskriver?.navn ?? `${title} ikke satt`}
        </StyledInfoLine>
      </div>
    );
  }

  return null;
};

const StyledInfoLine = styled.p`
  margin: 0;
  margin-bottom: 8px;
`;
