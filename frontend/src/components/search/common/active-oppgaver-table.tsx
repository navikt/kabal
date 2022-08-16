import { Alert, Table } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { StyledCaption } from '../../../styled-components/table';
import { IOppgave, IOppgaveList } from '../../../types/oppgaver';
import { Deadline } from '../../common-table-components/deadline';
import { Hjemmel } from '../../common-table-components/hjemmel';
import { OpenOppgavebehandling } from '../../common-table-components/open';
import { SaksbehandlerButton } from '../../common-table-components/saksbehandler-button';
import { Ytelse } from '../../common-table-components/ytelse';
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
          <Table.ColumnHeader>Frist</Table.ColumnHeader>
          <Table.ColumnHeader>Saksbehandler</Table.ColumnHeader>
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

const Row = ({
  id,
  type,
  ytelse,
  hjemmel,
  frist,
  ageKA,
  tildeltSaksbehandlerident,
  tildeltSaksbehandlerNavn,
  isAvsluttetAvSaksbehandler,
}: IOppgave) => (
  <Table.Row data-testid="search-result-active-oppgave">
    <Table.DataCell>
      <Type type={type} />
    </Table.DataCell>
    <Table.DataCell>
      <Ytelse ytelseId={ytelse} />
    </Table.DataCell>
    <Table.DataCell>
      <Hjemmel hjemmel={hjemmel} />
    </Table.DataCell>
    <Table.DataCell>
      <Deadline age={ageKA} frist={frist} />
    </Table.DataCell>
    <Table.DataCell>
      <SaksbehandlerButton
        tildeltSaksbehandlerident={tildeltSaksbehandlerident}
        name={tildeltSaksbehandlerNavn}
        klagebehandlingId={id}
        ytelse={ytelse}
        isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler}
      />
    </Table.DataCell>
    <Table.DataCell align="right">
      <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
    </Table.DataCell>
  </Table.Row>
);

const StyledTable = styled(Table)`
  max-width: 2048px;
  width: 100%;
`;
