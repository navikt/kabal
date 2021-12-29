import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useKlagerName } from '../../../hooks/use-klager-name';
import { StyledBehandlingsdetaljer, StyledHeader, StyledPaddedContent } from '../styled-components';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { SubSection } from './sub-section';
import { Type } from './type';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

export const Klagebehandlingsdetaljer = () => {
  const { data: oppgavebehandling, isLoading } = useOppgave();
  const klagerName = useKlagerName();

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const {
    type,
    mottattFoersteinstans,
    fraNAVEnhetNavn,
    fraNAVEnhet,
    mottattKlageinstans,
    kommentarFraFoersteinstans,
    resultat,
    ytelse,
  } = oppgavebehandling;

  return (
    <StyledBehandlingsdetaljer>
      <StyledPaddedContent>
        <StyledHeader>Behandling</StyledHeader>

        <SubSection label="Klager">{klagerName ?? ''}</SubSection>

        <Type typeId={type} />

        <Ytelse ytelseId={ytelse} />

        <SubSection label="Mottatt førsteinstans">{isoDateToPretty(mottattFoersteinstans)}</SubSection>
        <SubSection label="Fra NAV-enhet">
          {fraNAVEnhetNavn} - {fraNAVEnhet}
        </SubSection>
        <SubSection label="Mottatt klageinstans">{isoDateToPretty(mottattKlageinstans)}</SubSection>

        <SubSection label="Melding fra førsteinstans for intern bruk">{kommentarFraFoersteinstans}</SubSection>

        <UtfallResultat utfall={resultat.utfall} />

        <Lovhjemmel />
      </StyledPaddedContent>
    </StyledBehandlingsdetaljer>
  );
};
