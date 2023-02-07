import React from 'react';
import { EXTERNAL_URL_GOSYS, EXTERNAL_URL_MODIA } from '../../domain/eksterne-lenker';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { ISakspart } from '../../types/oppgavebehandling/oppgavebehandling';
import { PanelToggles } from '../oppgavebehandling/types';
import { StyledExtLinkIcon } from '../show-document/styled-components';
import { ControlPanel, ExternalLink, OppgavebehandlingInformation, OppgavebehandlingTools } from './styled-components';
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
        <GosysLink sakenGjelder={sakenGjelder} />
        <ModiaLink sakenGjelder={sakenGjelder} />
      </OppgavebehandlingInformation>
    </ControlPanel>
  );
};

interface LinkProps {
  sakenGjelder: ISakspart;
}

const GosysLink = ({ sakenGjelder }: LinkProps) => {
  if (typeof sakenGjelder.person?.foedselsnummer !== 'string') {
    return null;
  }

  return (
    <ExternalLink
      href={`${EXTERNAL_URL_GOSYS}/personoversikt/fnr=${sakenGjelder.person.foedselsnummer}`}
      target="_blank"
      aria-label="Ekstern lenke til Gosys for denne personen"
      title="Åpne i ny fane"
      rel="noreferrer"
    >
      <span>Gosys</span> <StyledExtLinkIcon title="Ekstern lenke" />
    </ExternalLink>
  );
};

const ModiaLink = ({ sakenGjelder }: LinkProps) => {
  if (typeof sakenGjelder.person?.foedselsnummer !== 'string') {
    return null;
  }

  return (
    <ExternalLink
      href={`${EXTERNAL_URL_MODIA}/person/${sakenGjelder.person.foedselsnummer}`}
      target="_blank"
      aria-label="Ekstern lenke til Modia for denne personen"
      title="Åpne i ny fane"
      rel="noreferrer"
    >
      <span>Modia</span> <StyledExtLinkIcon title="Ekstern lenke" />
    </ExternalLink>
  );
};
