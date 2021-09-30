import React from 'react';
import { isoDateToPretty } from '../../domain/date';
import { getFullName } from '../../domain/name';
import { IKlagebehandling, IKlager } from '../../redux-api/oppgave-state-types';
import { Labels } from './labels';
import { StyledHeader, StyledInfoDetails, StyledInfoLabel, StyledLeftContainer } from './styled-components';

interface VenstreProps {
  klagebehandling: IKlagebehandling;
}

export const Behandlingsdetaljer = ({ klagebehandling }: VenstreProps) => {
  const {
    klager,
    type,
    tema,
    mottattFoersteinstans,
    fraNAVEnhetNavn,
    mottattKlageinstans,
    kommentarFraFoersteinstans,
  } = klagebehandling;

  return (
    <StyledLeftContainer>
      <StyledHeader>Behandling</StyledHeader>

      <Info label="Klager" details={getKlagerNavn(klager)} />

      <Labels typeId={type} temaId={tema} />

      <Info label="Mottatt førsteinstans" details={isoDateToPretty(mottattFoersteinstans)} />
      <Info label="Fra NAV-enhet" details={fraNAVEnhetNavn} />
      <Info label="Mottatt klageinstans" details={isoDateToPretty(mottattKlageinstans)} />

      <Info label="Melding fra førsteinstans for intern bruk" details={kommentarFraFoersteinstans} />
    </StyledLeftContainer>
  );
};

interface InfoProps {
  label: string;
  details: React.ReactNode;
}

const Info = ({ label, details = '' }: InfoProps) => (
  <>
    <StyledInfoLabel>{label}:</StyledInfoLabel>
    <StyledInfoDetails>{details}</StyledInfoDetails>
  </>
);

const getKlagerNavn = ({ person, virksomhet }: IKlager): string => {
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
