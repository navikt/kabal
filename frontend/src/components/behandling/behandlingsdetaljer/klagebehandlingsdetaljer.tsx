import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useSakspartName } from '../../../hooks/use-klager-name';
import { PanelHeader } from '../../oppgavebehandling-panels/panel';
import { Type } from '../../type/type';
import { StyledBehandlingsdetaljer, StyledPaddedContent } from '../styled-components';
import { BehandlingSection } from './behandling-section';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { MottattVedtaksinstans } from './mottatt-vedtaksinstans';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

export const Klagebehandlingsdetaljer = () => {
  const { data: oppgavebehandling, isLoading } = useOppgave();
  const klagerName = useSakspartName('klager');

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const { type, fraNAVEnhetNavn, fraNAVEnhet, mottattKlageinstans, kommentarFraVedtaksinstans, resultat, ytelse } =
    oppgavebehandling;

  return (
    <StyledBehandlingsdetaljer>
      <StyledPaddedContent>
        <PanelHeader>Behandling</PanelHeader>

        <BehandlingSection label="Klager">{klagerName ?? ''}</BehandlingSection>

        <BehandlingSection label="Type">
          <Type type={type}></Type>
        </BehandlingSection>

        <Ytelse ytelseId={ytelse} />

        <MottattVedtaksinstans />
        <BehandlingSection label="Fra NAV-enhet">
          {fraNAVEnhetNavn} - {fraNAVEnhet}
        </BehandlingSection>
        <BehandlingSection label="Mottatt klageinstans">{isoDateToPretty(mottattKlageinstans)}</BehandlingSection>

        <BehandlingSection label="Melding fra vedtaksinstans for intern bruk">
          {kommentarFraVedtaksinstans}
        </BehandlingSection>

        <UtfallResultat utfall={resultat.utfall} />

        <Lovhjemmel />
      </StyledPaddedContent>
    </StyledBehandlingsdetaljer>
  );
};
