import React, { useState } from 'react';
import styled from 'styled-components';
import { IPersonResultat } from '../../redux-api/oppgaver';
import { ActiveOppgaverTable } from './active-oppgaver-table';
import { FullfoerteOppgaverTable } from './fullfoerte-oppgaver-table';
import { Oppgaver } from './oppgaver';

export const Result = ({ fnr, navn, aapneKlagebehandlinger, avsluttedeKlagebehandlinger }: IPersonResultat) => {
  const [open, setOpen] = useState<boolean>(false);

  const numberOfKlagebehandlinger = aapneKlagebehandlinger.length + avsluttedeKlagebehandlinger.length;

  return (
    <StyledResult key={fnr}>
      <StyledName>{formatName(navn)}</StyledName>
      <StyledFnr>{fnr}</StyledFnr>
      <SeSaker hasKlagebehandlinger={numberOfKlagebehandlinger !== 0} setOpen={setOpen} open={open} />
      <Oppgaver open={open}>
        <ActiveOppgaverTable activeOppgaver={aapneKlagebehandlinger} />
        <FullfoerteOppgaverTable finishedOppgaver={avsluttedeKlagebehandlinger} />
      </Oppgaver>
    </StyledResult>
  );
};

interface SeSakerProps {
  setOpen: (open: boolean) => void;
  open: boolean;
  hasKlagebehandlinger: boolean;
}

const SeSaker = ({ setOpen, open, hasKlagebehandlinger }: SeSakerProps) => {
  if (!hasKlagebehandlinger) {
    return <span>Ingen saker</span>;
  }

  return <StyledOpenButton onClick={() => setOpen(!open)}>{getOpenText(open)}</StyledOpenButton>;
};

const getOpenText = (open: boolean) => (open ? 'Skjul saker' : 'Se saker');

const formatName = (rawString: string): string => {
  if (rawString === '') {
    return '';
  }

  const nameArray = rawString
    .replace(/[\\[\]']+/g, '')
    .toLowerCase()
    .split(' ');

  return nameArray
    .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
    .reduce((firstName: string, lastName: string) => firstName + ' ' + lastName);
};

const StyledResult = styled.li`
  display: grid;
  grid-template-areas:
    'result-name result-fnr result-open'
    'oppgaver oppgaver oppgaver';
  grid-template-columns: 2fr 10em 10em;
  grid-column-gap: 16px;
  align-items: center;
  padding: 16px;
  padding-right: 32px;
  border-top: 1px solid #c6c2bf;
`;

const StyledName = styled.span`
  justify-self: left;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledFnr = styled.span`
  justify-self: left;
`;

const StyledOpenButton = styled.button`
  color: #0067c5;
  border: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  justify-self: right;
  font-size: 16px;
  cursor: pointer;
`;
