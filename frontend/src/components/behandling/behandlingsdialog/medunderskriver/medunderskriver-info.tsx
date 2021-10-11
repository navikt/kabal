import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { IKlagebehandling } from '../../../../redux-api/oppgave-state-types';

interface MedunderskriverInfoProps {
  klagebehandling: IKlagebehandling;
}

export const MedunderskriverInfo = ({ klagebehandling }: MedunderskriverInfoProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const canEdit = useCanEdit(klagebehandlingId);

  if (!canEdit) {
    return (
      <div>
        <StyledInfoLine>
          <b>Saksbehandler:</b> {klagebehandling.tildeltSaksbehandlerident}
        </StyledInfoLine>
        <StyledInfoLine>
          <b>Medunderskriver:</b> {klagebehandling.medunderskriverident}
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
