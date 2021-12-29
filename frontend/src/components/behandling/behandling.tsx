import React from 'react';
import { useOppgaveType } from '../../hooks/use-oppgave-type';
import { OppgaveType } from '../../redux-api/oppgavebehandling-common-types';
import { PanelContainer } from '../oppgavebehandling-panels/panel';
import { Ankebehandlingsdetaljer } from './behandlingsdetaljer/ankebehandlingsdetaljer';
import { Klagebehandlingsdetaljer } from './behandlingsdetaljer/klagebehandlingsdetaljer';
import { Behandlingsdialog } from './behandlingsdialog/behandlingsdialog';
import { StyledContainer } from './styled-components';

interface BehandlingProps {
  shown: boolean;
}

export const Behandling = ({ shown }: BehandlingProps) => {
  if (!shown) {
    return null;
  }

  return (
    <PanelContainer data-testid="behandling-panel">
      <StyledContainer>
        <Behandlingsdetaljer />
        <Behandlingsdialog />
      </StyledContainer>
    </PanelContainer>
  );
};

const Behandlingsdetaljer = () => {
  const type = useOppgaveType();

  if (type === OppgaveType.KLAGEBEHANDLING) {
    return <Klagebehandlingsdetaljer />;
  }

  return <Ankebehandlingsdetaljer />;
};
