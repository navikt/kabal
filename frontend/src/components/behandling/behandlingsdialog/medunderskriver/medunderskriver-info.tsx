import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { IMedunderskriverResponse } from '../../../../redux-api/oppgavebehandling-response-types';
import { IOppgavebehandling } from '../../../../redux-api/oppgavebehandling-types';

type MedunderskriverInfoProps = Pick<IOppgavebehandling, 'tildeltSaksbehandler'> &
  Pick<IMedunderskriverResponse, 'medunderskriver'>;

export const MedunderskriverInfo = ({ tildeltSaksbehandler, medunderskriver }: MedunderskriverInfoProps) => {
  const canEdit = useCanEdit();

  if (!canEdit) {
    return (
      <div data-testid="medunderskriver-info">
        <StyledInfoLine>
          <b>Saksbehandler:</b> {tildeltSaksbehandler?.navn ?? 'Ikke tildelt'}
        </StyledInfoLine>
        <StyledInfoLine>
          <b>Medunderskriver:</b> {medunderskriver?.navn ?? 'Medunderskriver ikke satt'}
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
