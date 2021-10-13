import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { isoDateToPretty } from '../../domain/date';
import { useHjemmelFromId, useTemaFromId, useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { IKlagebehandling, IKlagebehandlingList } from '../../redux-api/oppgaver';
import { LabelMain, LabelTema } from '../../styled-components/labels';

interface Props {
  activeOppgaver: IKlagebehandlingList;
}

export const FullfoerteOppgaverTable = ({ activeOppgaver }: Props) => (
  <StyledTable className="tabell tabell--stripet">
    <thead>
      <tr>
        <th>Aktive klager</th>
        <th></th>
        <th></th>
        <th>Frist</th>
        <th>Saksbehandler</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {activeOppgaver.map((k) => (
        <Row key={k.id} klagebehandling={k} />
      ))}
    </tbody>
  </StyledTable>
);

interface RowProps {
  klagebehandling: IKlagebehandling;
}

const Row = ({
  klagebehandling: { id, type, tema, hjemmel, frist, ageKA, tildeltSaksbehandlerident, tildeltSaksbehandlerNavn },
}: RowProps) => (
  <tr>
    <td>
      <LabelMain>{useTypeFromId(type)}</LabelMain>
    </td>
    <td>
      <LabelTema tema={tema}>{useTemaFromId(tema)}</LabelTema>
    </td>
    <td>
      <LabelMain>{useHjemmelFromId(hjemmel)}</LabelMain>
    </td>
    <td>
      <StyledDeadline age={ageKA} dateTime={frist}>
        {isoDateToPretty(frist)}
      </StyledDeadline>
    </td>
    <td>
      <Saksbehandler navIdent={tildeltSaksbehandlerident} navn={tildeltSaksbehandlerNavn} />
    </td>
    <td>
      <NavLink className="knapp knapp--hoved" to={`/klagebehandling/${id}`}>
        Åpne
      </NavLink>
    </td>
  </tr>
);

interface SaksbehandlerProps {
  navIdent: string | null;
  navn: string | null;
}

const Saksbehandler = ({ navIdent, navn }: SaksbehandlerProps) => {
  if (navIdent === null) {
    return <Knapp>Tildel meg</Knapp>;
  }

  return <span>{navn ?? 'Ukjent saksbehandler'}</span>;
};

const StyledTable = styled.table``;

interface StyledAgeProps {
  age: number;
}

export const StyledDeadline = styled.time<StyledAgeProps>`
  color: ${({ age }) => (age >= 120 ? '#C30000' : '#54483F')};
`;
