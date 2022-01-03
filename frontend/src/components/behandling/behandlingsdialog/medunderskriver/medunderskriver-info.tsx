import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { IOppgavebehandlingBase } from '../../../../types/oppgavebehandling';
import { IMedunderskriverResponse } from '../../../../types/oppgavebehandling-response';

type MedunderskriverInfoProps = Pick<IOppgavebehandlingBase, 'tildeltSaksbehandler'> &
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
