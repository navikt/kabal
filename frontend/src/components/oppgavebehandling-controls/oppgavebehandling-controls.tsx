import React from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { PanelToggles } from '../oppgavebehandling/types';
import { AaRegisteret, Ainntekt, Gosys, Modia } from './external-links';
import { ControlPanel, OppgavebehandlingInformation, OppgavebehandlingTools } from './styled-components';
import { PanelToggleButtons } from './toggle-buttons';
import { UserInfo } from './user-info';

interface OppgavebehandlingControlsProps {
  toggles: PanelToggles;
  switches: PanelToggles;
  setPanel: (panel: keyof PanelToggles, checked: boolean) => void;
}

export const OppgavebehandlingControls = ({ toggles, setPanel, switches }: OppgavebehandlingControlsProps) => {
  const { data: oppgave } = useOppgave();

  if (typeof oppgave === 'undefined') {
    return <ControlPanel>Laster...</ControlPanel>;
  }

  const { fortrolig, strengtFortrolig, sakenGjelder } = oppgave;

  return (
    <ControlPanel data-testid="klagebehandling-control-panel">
      <OppgavebehandlingTools data-testid="klagebehandling-control-panel-tools">
        <UserInfo sakenGjelder={sakenGjelder} fortrolig={fortrolig} strengtFortrolig={strengtFortrolig} />
        <PanelToggleButtons togglePanel={setPanel} toggles={toggles} switches={switches} />
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
