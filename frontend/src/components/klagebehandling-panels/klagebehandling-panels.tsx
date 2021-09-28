import React from 'react';
import styled from 'styled-components';
import { Dokumenter } from '../dokumenter/dokumenter';
import { PanelToggles } from '../klagebehandling/types';
import { PanelContainer } from './panel';

interface KlagebehandlingPanelsProps {
  toggles: PanelToggles;
}

export const KlagebehandlingPanels = ({ toggles }: KlagebehandlingPanelsProps): JSX.Element => (
  //   const [fullvisning, settFullvisning] = useState<boolean>(true);
  //   useKlagebehandlingUpdater(klagebehandling);

  <PageContainer data-testid={'behandlingsdetaljer'}>
    <Dokumenter shown={toggles.documents} />
    <PanelContainer>Panel 2</PanelContainer>
    <PanelContainer>Panel 3</PanelContainer>
    {/* <Behandlingsdetaljer skjult={!faner.detaljer.checked} klagebehandling={klagebehandling} />
      <Kvalitetsvurdering skjult={!faner.kvalitetsvurdering.checked} klagebehandling={klagebehandling} />
      <FullforVedtak skjult={!faner.vedtak.checked} klagebehandling={klagebehandling} /> */}
  </PageContainer>
);

const PageContainer = styled.main`
  display: flex;
  margin: 0 0.25em 0 0;
  height: calc(100% - 3em);
  overflow-x: scroll;
  overflow-y: hidden;
  padding-bottom: 0.5em;

  @media screen and (max-width: 1400px) {
    height: calc(100% - 6.25em);
  }
`;
