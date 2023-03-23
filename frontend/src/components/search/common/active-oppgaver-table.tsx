import { Alert, Table } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { StyledCaption } from '@app/styled-components/table';
import { IOppgave, IOppgaveList } from '@app/types/oppgaver';
import { Age } from '../../common-table-components/age';
import { Deadline } from '../../common-table-components/deadline';
import { Hjemmel } from '../../common-table-components/hjemmel';
import { OpenOppgavebehandling } from '../../common-table-components/open';
import { Ytelse } from '../../common-table-components/ytelse';
import { Oppgavestyring } from '../../oppgavestyring/oppgavestyring';
import { Type } from '../../type/type';

interface Props {
  activeOppgaver: IOppgaveList;
}

export const ActiveOppgaverTable = ({ activeOppgaver }: Props) => {
  if (activeOppgaver.length === 0) {
    return <Alert variant="info">Ingen aktive oppgaver</Alert>;
  }

  return (
    <StyledTable data-testid="search-result-active-oppgaver" zebraStripes>
      <StyledCaption>Aktive oppgaver</StyledCaption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Type</Table.ColumnHeader>
          <Table.ColumnHeader>Ytelse</Table.ColumnHeader>
          <Table.ColumnHeader>Hjemmel</Table.ColumnHeader>
          <Table.ColumnHeader>Alder</Table.ColumnHeader>
          <Table.ColumnHeader>Frist</Table.ColumnHeader>
          <Table.ColumnHeader>Tildeling</Table.ColumnHeader>
          <Table.ColumnHeader></Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {activeOppgaver.map((k) => (
          <Row key={k.id} {...k} />
        ))}
      </Table.Body>
    </StyledTable>
  );
};

const Row = (oppgave: IOppgave) => (
  <Table.Row data-testid="search-result-active-oppgave" data-klagebehandlingid={oppgave.id}>
    <Table.DataCell>
      <Type type={oppgave.type} />
    </Table.DataCell>
    <Table.DataCell>
      <Ytelse ytelseId={oppgave.ytelse} />
    </Table.DataCell>
    <Table.DataCell>
      <Hjemmel hjemmel={oppgave.hjemmel} />
    </Table.DataCell>
    <Table.DataCell>
      <Age age={oppgave.ageKA} oppgaveId={oppgave.id} mottattDate={oppgave.mottatt} />
    </Table.DataCell>
    <Table.DataCell>
      <Deadline age={oppgave.ageKA} frist={oppgave.frist} oppgaveId={oppgave.id} type={oppgave.type} />
    </Table.DataCell>
    <Table.DataCell>
      <Oppgavestyring {...oppgave} />
    </Table.DataCell>
    <Table.DataCell align="right">
      <OpenOppgavebehandling
        oppgavebehandlingId={oppgave.id}
        ytelse={oppgave.ytelse}
        type={oppgave.type}
        tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
        medunderskriverident={oppgave.medunderskriverident}
      />
    </Table.DataCell>
  </Table.Row>
);

const StyledTable = styled(Table)`
  max-width: 2500px;
  width: 100%;
`;
