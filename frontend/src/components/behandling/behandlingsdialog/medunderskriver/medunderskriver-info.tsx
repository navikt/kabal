import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { IKlagebehandling } from '../../../../redux-api/oppgave-state-types';
import { IMedunderskriverInfoResponse } from '../../../../redux-api/oppgave-types';

interface MedunderskriverInfoProps {
  klagebehandling: IKlagebehandling;
  medunderskriverInfo: IMedunderskriverInfoResponse;
}

export const MedunderskriverInfo = ({ klagebehandling, medunderskriverInfo }: MedunderskriverInfoProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const canEdit = useCanEdit(klagebehandlingId);

  if (!canEdit) {
    return (
      <div data-testid="medunderskriver-info">
        <StyledInfoLine>
          <b>Saksbehandler:</b> {klagebehandling.tildeltSaksbehandler?.navn ?? 'Ikke tildelt'}
        </StyledInfoLine>
        <StyledInfoLine>
          <b>Medunderskriver:</b> {medunderskriverInfo?.medunderskriver?.navn ?? 'Medunderskriver ikke satt'}
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
