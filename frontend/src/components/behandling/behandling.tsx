import React from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { OppgaveType } from '../../types/kodeverk';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { Ankebehandlingsdetaljer } from './behandlingsdetaljer/ankebehandlingsdetaljer';
import { Klagebehandlingsdetaljer } from './behandlingsdetaljer/klagebehandlingsdetaljer';
import { Trygderettsankebehandlingsdetaljer } from './behandlingsdetaljer/trygderettsankebehandlingsdetaljer';
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
  const { data: oppgave } = useOppgave();

  if (typeof oppgave === 'undefined') {
    return null;
  }

  if (oppgave.type === OppgaveType.KLAGE) {
    return <Klagebehandlingsdetaljer />;
  }

  if (oppgave.type === OppgaveType.ANKE) {
    return <Ankebehandlingsdetaljer />;
  }

  return <Trygderettsankebehandlingsdetaljer />;
};
