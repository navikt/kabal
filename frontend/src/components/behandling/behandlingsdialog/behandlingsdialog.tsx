import React from 'react';
import { useGetBrukerQuery } from '../../../redux-api/bruker';
import { IKlagebehandling } from '../../../redux-api/oppgave-state-types';
import { BehandlingsdialogContent, StyledBehandlingsdialog, StyledSubHeader } from '../styled-components';
import { Medunderskriver } from './medunderskriver/medunderskriver';
import { Messages } from './messages/messages';

interface BehandlingsDialogProps {
  klagebehandling: IKlagebehandling;
}

export const Behandlingsdialog = ({ klagebehandling }: BehandlingsDialogProps) => {
  const { data: bruker } = useGetBrukerQuery();

  if (typeof bruker === 'undefined') {
    return null;
  }

  return (
    <StyledBehandlingsdialog>
      <StyledSubHeader>Behandlingsdialog</StyledSubHeader>
      <BehandlingsdialogContent>
        <Medunderskriver klagebehandling={klagebehandling} bruker={bruker} />
        <Messages />
      </BehandlingsdialogContent>
    </StyledBehandlingsdialog>
  );
};
