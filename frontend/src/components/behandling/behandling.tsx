import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { StyledContainer, StyledHeader, StyledInfoHeader, StyledLabels } from './styled-components';
import { IKlager } from '../../redux-api/oppgave-state-types';
import { getFullName } from '../../domain/name';
import { LabelTema, LabelType } from '../../styled-components/labels';
import { PanelContainer } from '../klagebehandling-panels/panel';

interface BehandlingProps {
  shown: boolean;
}

export const Behandling = ({ shown }: BehandlingProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(id);

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <span>Behandling laster ...</span>;
  }

  if (!shown) {
    return null;
  }
  const { klager, type, tema, mottattFoersteinstans, fraNAVEnhet, mottattKlageinstans, kommentarFraFoersteinstans } =
    klagebehandling;

  return (
    <PanelContainer>
      <StyledContainer>
        <StyledHeader>Behandling</StyledHeader>

        <Info label="Klager" details={getNavn(klager)} />

        <Labels type={type} tema={tema} />

        <Info label="Mottatt førsteinstans" details={mottattFoersteinstans} />
        <Info label="Fra NAV-enhet" details={fraNAVEnhet} />
        <Info label="Mottatt klageinstans" details={mottattKlageinstans} />
        <Info label="Melding fra førsteinstans for intern bruk" details={kommentarFraFoersteinstans} />
      </StyledContainer>
    </PanelContainer>
  );
};

interface LabelsProps {
  type: string;
  tema: string;
}

const Labels = ({ type, tema }: LabelsProps) => (
  <StyledLabels>
    <Info label="Type" details={<LabelType>{type}</LabelType>} />
    <Info label="Tema" details={<LabelTema tema={tema} />} />
  </StyledLabels>
);

interface InfoProps {
  label: string;
  details: React.ReactNode;
}

const Info = ({ label, details = '' }: InfoProps) => (
  <div>
    <StyledInfoHeader>{label}:</StyledInfoHeader>
    <p>{details}</p>
  </div>
);

const getNavn = ({ person, virksomhet }: IKlager): string => {
  if (person) {
    return getFullName(person.navn);
  }
  if (virksomhet) {
    return `${virksomhet.navn ?? ''} ${virksomhet.virksomhetsnummer ? `(${virksomhet.virksomhetsnummer})` : ''}`;
  }
  return '';
};
