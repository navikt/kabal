import React from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../domain/date';
import { IKlagebehandling, IKlagebehandlingList } from '../../redux-api/oppgaver';
import { Hjemmel } from '../common-table-components/hjemmel';
import { OpenKlagebehandling } from '../common-table-components/open';
import { Tema } from '../common-table-components/tema';
import { Type } from '../common-table-components/type';

interface Props {
  finishedOppgaver: IKlagebehandlingList;
}

export const FullfoerteOppgaverTable = ({ finishedOppgaver }: Props) => (
  <StyledTable className="tabell tabell--stripet">
    <thead>
      <tr>
        <th>Fullførte klager siste 12 måneder</th>
        <th></th>
        <th></th>
        <th>Fullført</th>
        <th>Saksbehandler</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {finishedOppgaver.map((k) => (
        <Row key={k.id} {...k} />
      ))}
    </tbody>
  </StyledTable>
);

const Row = ({ id, type, tema, hjemmel, avsluttetAvSaksbehandlerDate, tildeltSaksbehandlerNavn }: IKlagebehandling) => (
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
    <td>{isoDateToPretty(avsluttetAvSaksbehandlerDate)}</td>
    <td>{tildeltSaksbehandlerNavn}</td>
    <td>
      <OpenKlagebehandling klagebehandlingId={id} tema={tema} />
    </td>
  </tr>
);

const StyledTable = styled.table`
  margin: 20px 0;
`;
