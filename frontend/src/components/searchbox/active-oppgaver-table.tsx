import React from 'react';
import styled from 'styled-components';
import { IKlagebehandling, IKlagebehandlingList } from '../../redux-api/oppgaver';
import { Deadline } from '../common-table-components/deadline';
import { Hjemmel } from '../common-table-components/hjemmel';
import { OpenKlagebehandling } from '../common-table-components/open';
import { SaksbehandlerButton } from '../common-table-components/saksbehandler-button';
import { Tema } from '../common-table-components/tema';
import { Type } from '../common-table-components/type';

interface Props {
  activeOppgaver: IKlagebehandlingList;
}

export const ActiveOppgaverTable = ({ activeOppgaver }: Props) => (
  <StyledTable className="tabell tabell--stripet" data-testid="search-result-active-oppgaver">
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
  isAvsluttetAvSaksbehandler,
}: IKlagebehandling) => (
  <tr data-testid="search-result-active-oppgave">
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
      <SaksbehandlerButton
        tildeltSaksbehandlerident={tildeltSaksbehandlerident}
        name={tildeltSaksbehandlerNavn}
        klagebehandlingId={id}
        tema={tema}
        isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler}
      />
      {/* <Saksbehandler
        navIdent={tildeltSaksbehandlerident}
        navn={tildeltSaksbehandlerNavn}
        klagebehandlingId={id}
        tema={tema}
      /> */}
    </td>
    <td>
      <OpenKlagebehandling klagebehandlingId={id} tema={tema} />
    </td>
  </tr>
);

// interface SaksbehandlerProps {
//   navIdent: string | null;
//   navn: string | null;
//   klagebehandlingId: string;
//   tema: string;
// }

// const Saksbehandler = ({ navIdent, navn, klagebehandlingId, tema }: SaksbehandlerProps) => {
//   if (navIdent === null) {
//     return <TildelKlagebehandlingButton klagebehandlingId={klagebehandlingId} tema={tema} />;
//   }

//   return <span>{navn ?? 'Ukjent saksbehandler'}</span>;
// };

const StyledTable = styled.table`
  margin: 20px;
`;
