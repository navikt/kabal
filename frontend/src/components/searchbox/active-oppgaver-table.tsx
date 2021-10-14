import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { IKlagebehandling, IKlagebehandlingList } from '../../redux-api/oppgaver';
import { Deadline } from '../common-table-components/deadline';
import { Hjemmel } from '../common-table-components/hjemmel';
import { OpenKlagebehandling } from '../common-table-components/open';
import { Tema } from '../common-table-components/tema';
import { Type } from '../common-table-components/type';

interface Props {
  activeOppgaver: IKlagebehandlingList;
}

export const ActiveOppgaverTable = ({ activeOppgaver }: Props) => (
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
        <Row key={k.id} {...k} />
      ))}
    </tbody>
  </StyledTable>
);

const Row = ({
  id,
  type,
  tema,
  hjemmel,
  frist,
  ageKA,
  tildeltSaksbehandlerident,
  tildeltSaksbehandlerNavn,
}: IKlagebehandling) => (
  <tr>
    <td>
      <Type type={type} />
    </td>
    <td>
      <Tema tema={tema} />
    </td>
    <td>
      <Hjemmel hjemmel={hjemmel} />
    </td>
    <td>
      <Deadline age={ageKA} frist={frist} />
    </td>
    <td>
      <Saksbehandler navIdent={tildeltSaksbehandlerident} navn={tildeltSaksbehandlerNavn} />
    </td>
    <td>
      <OpenKlagebehandling klagebehandlingId={id} tema={tema} />
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
