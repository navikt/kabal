import React from 'react';
import { EXTERNAL_URL_GOSYS } from '../../domain/eksterne-lenker';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { ISakenGjelder } from '../../redux-api/oppgave-state-types';
import { PanelToggles } from '../klagebehandling/types';
import { StyledExtLinkIcon } from '../show-document/styled-components';
import { ControlPanel, ExternalLink, KlagebehandlingInformation, KlagebehandlingTools } from './styled-components';
import { PanelToggleButtons } from './toggle-buttons';
import { UserInfo } from './user-info';

interface KlagebehandlingControlsProps {
  toggles: PanelToggles;
  setPanel: (panel: keyof PanelToggles, checked: boolean) => void;
}

export const KlagebehandlingControls = ({ toggles, setPanel }: KlagebehandlingControlsProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);

  if (typeof klagebehandling === 'undefined') {
    return <ControlPanel>Laster...</ControlPanel>;
  }

  const { fortrolig, strengtFortrolig, sakenGjelder } = klagebehandling;

  return (
    <ControlPanel data-testid="klagebehandling-control-panel">
      <KlagebehandlingTools data-testid="klagebehandling-control-panel-tools">
        <UserInfo sakenGjelder={sakenGjelder} fortrolig={fortrolig} strengtFortrolig={strengtFortrolig} />
        <PanelToggleButtons togglePanel={setPanel} toggles={toggles} />
      </KlagebehandlingTools>
      <KlagebehandlingInformation>
        <GosysLink sakenGjelder={sakenGjelder} />
      </KlagebehandlingInformation>
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
        target={'_blank'}
        aria-label={'Ekstern lenke til Gosys for denne personen'}
        title="Åpne i ny fane"
        rel="noreferrer"
      >
        <span>Gosys</span> <StyledExtLinkIcon alt="Ekstern lenke" />
      </ExternalLink>
    );
  }

  return null;
};
