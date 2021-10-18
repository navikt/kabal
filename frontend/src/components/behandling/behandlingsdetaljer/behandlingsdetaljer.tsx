import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { useKlagebehandling } from '../../../hooks/use-klagebehandling';
import { useKlagerName } from '../../../hooks/use-klager-name';
import { StyledBehandlingsdetaljer, StyledHeader, StyledPaddedContent } from '../styled-components';
import { FinishKlagebehandling } from './finish-klagebehandling/finish-klagebehandling';
import { Labels } from './labels';
import { Lovhjemmel } from './lovhjemmel';
import { SubSection } from './sub-section';
import { UtfallResultat } from './utfall-resultat';

export const Behandlingsdetaljer = () => {
  const [klagebehandling, isLoading] = useKlagebehandling();
  const klagerName = useKlagerName();

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const {
    type,
    tema,
    mottattFoersteinstans,
    fraNAVEnhetNavn,
    fraNAVEnhet,
    mottattKlageinstans,
    kommentarFraFoersteinstans,
    resultat,
  } = klagebehandling;

  return (
    <StyledBehandlingsdetaljer>
      <StyledPaddedContent>
        <StyledHeader>Behandling</StyledHeader>

        <SubSection label="Klager">{klagerName ?? ''}</SubSection>

        <Labels typeId={type} temaId={tema} />

        <SubSection label="Mottatt førsteinstans">{isoDateToPretty(mottattFoersteinstans)}</SubSection>
        <SubSection label="Fra NAV-enhet">
          {fraNAVEnhetNavn} - {fraNAVEnhet}
        </SubSection>
        <SubSection label="Mottatt klageinstans">{isoDateToPretty(mottattKlageinstans)}</SubSection>

        <SubSection label="Melding fra førsteinstans for intern bruk">{kommentarFraFoersteinstans}</SubSection>

        <UtfallResultat utfall={resultat.utfall} />

        <Lovhjemmel hjemler={resultat.hjemler} />
      </StyledPaddedContent>

      <FinishKlagebehandling />
    </StyledBehandlingsdetaljer>
  );
};
