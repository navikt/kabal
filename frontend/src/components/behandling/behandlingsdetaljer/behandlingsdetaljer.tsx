import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { getFullName } from '../../../domain/name';
import { IKlagebehandling, IKlager } from '../../../redux-api/oppgave-state-types';
import { IKlagebehandlingUpdate } from '../../../redux-api/oppgave-types';
import { StyledBehandlingsdetaljer, StyledHeader, StyledPaddedContent } from '../styled-components';
import { FinishKlagebehandling } from './finish-klagebehandling';
import { Labels } from './labels';
import { Lovhjemmel } from './lovhjemmel';
import { SubSection } from './sub-section';
import { UtfallResultat } from './utfall-resultat';

interface VenstreProps {
  klagebehandling: IKlagebehandling;
  onChange: (klagebehandlingUpdate: Partial<IKlagebehandlingUpdate>) => void;
}

export const Behandlingsdetaljer = ({ klagebehandling, onChange }: VenstreProps) => {
  const {
    klager,
    type,
    tema,
    mottattFoersteinstans,
    fraNAVEnhetNavn,
    fraNAVEnhet,
    mottattKlageinstans,
    kommentarFraFoersteinstans,
    vedtaket,
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

        <UtfallResultat onChange={onChange} utfall={vedtaket.utfall} />

        <Lovhjemmel onChange={onChange} hjemler={vedtaket.hjemler} />
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
