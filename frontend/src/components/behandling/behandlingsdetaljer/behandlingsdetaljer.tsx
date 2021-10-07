import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { getFullName } from '../../../domain/name';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { useGetKlagebehandlingQuery } from '../../../redux-api/oppgave';
import { IKlager } from '../../../redux-api/oppgave-state-types';
import { StyledBehandlingsdetaljer, StyledHeader, StyledPaddedContent } from '../styled-components';
import { FinishKlagebehandling } from './finish-klagebehandling';
import { Labels } from './labels';
import { Lovhjemmel } from './lovhjemmel';
import { SubSection } from './sub-section';
import { UtfallResultat } from './utfall-resultat';

export const Behandlingsdetaljer = () => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);

  if (typeof klagebehandling === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const {
    klager,
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

        <SubSection label="Klager">{getKlagerName(klager)}</SubSection>

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

const getKlagerName = ({ person, virksomhet }: IKlager): string => {
  if (person !== null) {
    return getFullName(person.navn);
  }

  if (virksomhet !== null) {
    return `${virksomhet.navn ?? ''} ${
      virksomhet.virksomhetsnummer === null ? '' : `(${virksomhet.virksomhetsnummer})`
    }`;
  }

  return '';
};
