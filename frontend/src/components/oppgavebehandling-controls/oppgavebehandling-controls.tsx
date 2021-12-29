import React from 'react';
import { EXTERNAL_URL_GOSYS } from '../../domain/eksterne-lenker';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { ISakenGjelder } from '../../redux-api/klagebehandling-state-types';
import { PanelToggles } from '../klagebehandling/types';
import { StyledExtLinkIcon } from '../show-document/styled-components';
import { ControlPanel, ExternalLink, OppgavebehandlingInformation, OppgavebehandlingTools } from './styled-components';
import { PanelToggleButtons } from './toggle-buttons';
import { UserInfo } from './user-info';

interface OppgavebehandlingControlsProps {
  toggles: PanelToggles;
  setPanel: (panel: keyof PanelToggles, checked: boolean) => void;
}

export const OppgavebehandlingControls = ({ toggles, setPanel }: OppgavebehandlingControlsProps) => {
  const { data: oppgavebehandling } = useOppgave();

  if (typeof oppgavebehandling === 'undefined') {
    return <ControlPanel>Laster...</ControlPanel>;
  }

  const { fortrolig, strengtFortrolig, sakenGjelder } = oppgavebehandling;

  return (
    <ControlPanel data-testid="klagebehandling-control-panel">
      <OppgavebehandlingTools data-testid="klagebehandling-control-panel-tools">
        <UserInfo sakenGjelder={sakenGjelder} fortrolig={fortrolig} strengtFortrolig={strengtFortrolig} />
        <PanelToggleButtons togglePanel={setPanel} toggles={toggles} />
      </OppgavebehandlingTools>
      <OppgavebehandlingInformation>
        <GosysLink sakenGjelder={sakenGjelder} />
      </OppgavebehandlingInformation>
    </ControlPanel>
  );
};

interface GosysLinkProps {
  sakenGjelder: ISakenGjelder;
}

const GosysLink = ({ sakenGjelder }: GosysLinkProps) => {
  if (sakenGjelder.person !== null) {
    return (
      <ExternalLink
        href={`${EXTERNAL_URL_GOSYS}/personoversikt/fnr=${sakenGjelder.person.foedselsnummer}`}
        target="_blank"
        aria-label="Ekstern lenke til Gosys for denne personen"
        title="Åpne i ny fane"
        rel="noreferrer"
      >
        <span>Gosys</span> <StyledExtLinkIcon alt="Ekstern lenke" />
      </ExternalLink>
    );
  }

  return null;
};
