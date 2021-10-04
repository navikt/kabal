import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { getFullName } from '../../../domain/name';
import { IKlagebehandling, IKlager } from '../../../redux-api/oppgave-state-types';
import { IKlagebehandlingUpdate } from '../../../redux-api/oppgave-types';
import { StyledBehandlingsdetaljer, StyledHeader, StyledInfoChildren, StyledInfoHeader } from '../styled-components';
import { FullfoerKlagebehandling } from './fullfoer-klagebehandling';
import { Labels } from './labels';
// import { Lovhjemmel } from './lovhjemmel';
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
      <StyledHeader>Behandling</StyledHeader>

      <Info label="Klager">{getKlagerName(klager)}</Info>

      <Labels typeId={type} temaId={tema} />

      <Info label="Mottatt førsteinstans">{isoDateToPretty(mottattFoersteinstans)}</Info>
      <Info label="Fra NAV-enhet">
        {fraNAVEnhetNavn} - {fraNAVEnhet}
      </Info>
      <Info label="Mottatt klageinstans">{isoDateToPretty(mottattKlageinstans)}</Info>

      <Info label="Melding fra førsteinstans for intern bruk">{kommentarFraFoersteinstans}</Info>

      <UtfallResultat onChange={onChange} utfall={vedtaket.utfall} />

      {/* <Lovhjemmel onChange={onChange} hjemler={vedtaket.hjemler} /> */}

      <FullfoerKlagebehandling />
    </StyledBehandlingsdetaljer>
  );
};

interface InfoProps {
  label: string;
  children: React.ReactNode;
}

const Info = ({ label, children }: InfoProps) => (
  <label>
    <StyledInfoHeader>{label}:</StyledInfoHeader>
    <StyledInfoChildren>{children}</StyledInfoChildren>
  </label>
);

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
