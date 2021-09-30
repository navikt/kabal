import React from 'react';
import { useParams } from 'react-router-dom';
import { EXTERNAL_URL_GOSYS } from '../../domain/eksterne-lenker';
import { SuccessIcon } from '../../icons/success';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { PanelToggles } from '../klagebehandling/types';
import { StyledExtLinkIcon } from '../show-document/styled-components';
import {
  ControlPanel,
  ExternalLink,
  KlagebehandlingInformation,
  KlagebehandlingTools,
  StyledSaveStatus,
} from './styled-components';
import { PanelToggleButtons } from './toggle-buttons';
import { UserInfo } from './user-info';

interface Params {
  id: string;
}

interface KlagebehandlingControlsProps {
  toggles: PanelToggles;
  setPanel: (panel: keyof PanelToggles, checked: boolean) => void;
}

export const KlagebehandlingControls = ({ toggles, setPanel }: KlagebehandlingControlsProps) => {
  const { id } = useParams<Params>();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(id);

  if (typeof klagebehandling === 'undefined') {
    return <ControlPanel>Laster...</ControlPanel>;
  }

  const { sakenGjelderNavn, sakenGjelderFoedselsnummer, sakenGjelderKjoenn, fortrolig, strengtFortrolig } =
    klagebehandling;

  return (
    <ControlPanel>
      <KlagebehandlingTools>
        <UserInfo
          name={sakenGjelderNavn}
          fnr={sakenGjelderFoedselsnummer}
          gender={sakenGjelderKjoenn}
          fortrolig={fortrolig}
          strengtFortrolig={strengtFortrolig}
        />
        <PanelToggleButtons togglePanel={setPanel} toggles={toggles} />
      </KlagebehandlingTools>
      <KlagebehandlingInformation>
        <ExternalLink
          href={`${EXTERNAL_URL_GOSYS}/personoversikt/fnr=${sakenGjelderFoedselsnummer}`}
          target={'_blank'}
          aria-label={'Ekstern lenke til Gosys for denne personen'}
          title="Åpne i ny fane"
          rel="noreferrer"
        >
          <span>Gosys</span> <StyledExtLinkIcon alt="Ekstern lenke" />
        </ExternalLink>
        <SaveStatus />
      </KlagebehandlingInformation>
    </ControlPanel>
  );
};

// TODO
const SaveStatus = () => (
  <StyledSaveStatus>
    <SuccessIcon alt="Lagret" /> <span>Lagret</span>
  </StyledSaveStatus>
);
