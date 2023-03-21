import React from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { AaRegisteret, Ainntekt, Gosys, Modia } from './external-links';
import { ControlPanel, OppgavebehandlingInformation, OppgavebehandlingTools } from './styled-components';
import { PanelToggleButtons } from './toggle-buttons';
import { UserInfo } from './user-info';

export const OppgavebehandlingControls = () => {
  const { data: oppgave } = useOppgave();

  if (typeof oppgave === 'undefined') {
    return <ControlPanel>Laster...</ControlPanel>;
  }

  const { fortrolig, strengtFortrolig, sakenGjelder } = oppgave;

  return (
    <ControlPanel data-testid="klagebehandling-control-panel">
      <OppgavebehandlingTools data-testid="klagebehandling-control-panel-tools">
        <UserInfo sakenGjelder={sakenGjelder} fortrolig={fortrolig} strengtFortrolig={strengtFortrolig} />
        <PanelToggleButtons />
      </OppgavebehandlingTools>
      <OppgavebehandlingInformation>
        <Gosys sakenGjelder={sakenGjelder} />
        <Modia sakenGjelder={sakenGjelder} />
        <AaRegisteret />
        <Ainntekt />
      </OppgavebehandlingInformation>
    </ControlPanel>
  );
};
