import React from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useBehandlingEnabled } from '@app/hooks/settings/use-setting';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { Ankebehandlingsdetaljer } from './behandlingsdetaljer/ankebehandlingsdetaljer';
import { Klagebehandlingsdetaljer } from './behandlingsdetaljer/klagebehandlingsdetaljer';
import { Trygderettsankebehandlingsdetaljer } from './behandlingsdetaljer/trygderettsankebehandlingsdetaljer';
import { Behandlingsdialog } from './behandlingsdialog/behandlingsdialog';
import { StyledContainer } from './styled-components';

export const Behandling = () => {
  const { value: shown = true, isLoading } = useBehandlingEnabled();

  if (!shown || isLoading) {
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

  if (oppgave.typeId === SaksTypeEnum.KLAGE) {
    return <Klagebehandlingsdetaljer />;
  }

  if (oppgave.typeId === SaksTypeEnum.ANKE) {
    return <Ankebehandlingsdetaljer />;
  }

  return <Trygderettsankebehandlingsdetaljer />;
};
