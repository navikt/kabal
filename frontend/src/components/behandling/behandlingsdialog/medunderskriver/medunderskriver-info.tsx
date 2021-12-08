import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { IKlagebehandling } from '../../../../redux-api/oppgave-state-types';
import { IMedunderskriverResponse } from '../../../../redux-api/oppgave-types';

interface MedunderskriverInfoProps {
  klagebehandling: IKlagebehandling;
  medunderskriver: IMedunderskriverResponse;
}

export const MedunderskriverInfo = ({ klagebehandling, medunderskriver }: MedunderskriverInfoProps) => {
  const canEdit = useCanEdit();

  if (!canEdit) {
    return (
      <div data-testid="medunderskriver-info">
        <StyledInfoLine>
          <b>Saksbehandler:</b> {klagebehandling.tildeltSaksbehandler?.navn ?? 'Ikke tildelt'}
        </StyledInfoLine>
        <StyledInfoLine>
          <b>Medunderskriver:</b> {medunderskriver?.medunderskriver?.navn ?? 'Medunderskriver ikke satt'}
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
