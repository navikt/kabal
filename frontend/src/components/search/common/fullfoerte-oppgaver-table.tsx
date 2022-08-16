import { Alert, Table } from '@navikt/ds-react';
import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { StyledCaption } from '../../../styled-components/table';
import { IOppgave, IOppgaveList } from '../../../types/oppgaver';
import { Hjemmel } from '../../common-table-components/hjemmel';
import { OpenOppgavebehandling } from '../../common-table-components/open';
import { Ytelse } from '../../common-table-components/ytelse';
import { Type } from '../../type/type';

interface Props {
  finishedOppgaver: IOppgaveList;
}

export const FullfoerteOppgaverTable = ({ finishedOppgaver }: Props) => {
  if (finishedOppgaver.length === 0) {
    return <Alert variant="info">Ingen fullførte oppgaver siste 12 måneder</Alert>;
  }

  return (
    <Table data-testid="search-result-fullfoerte-oppgaver" zebraStripes>
      <StyledCaption>Fullførte oppgaver siste 12 måneder</StyledCaption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Type</Table.ColumnHeader>
          <Table.ColumnHeader>Ytelse</Table.ColumnHeader>
          <Table.ColumnHeader>Hjemmel</Table.ColumnHeader>
          <Table.ColumnHeader>Fullført</Table.ColumnHeader>
          <Table.ColumnHeader>Saksbehandler</Table.ColumnHeader>
          <Table.ColumnHeader></Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {finishedOppgaver.map((k) => (
          <Row key={k.id} {...k} />
        ))}
      </Table.Body>
    </Table>
  );
};

const Row = ({ id, type, hjemmel, ytelse, avsluttetAvSaksbehandlerDate, tildeltSaksbehandlerNavn }: IOppgave) => (
  <Table.Row data-testid="search-result-fullfoert-oppgave">
    <Table.DataCell>
      <Type type={type} />
    </Table.DataCell>
    <Table.DataCell>
      <Ytelse ytelseId={ytelse} />
    </Table.DataCell>
    <Table.DataCell>
      <Hjemmel hjemmel={hjemmel} />
    </Table.DataCell>
    <Table.DataCell>{isoDateToPretty(avsluttetAvSaksbehandlerDate)}</Table.DataCell>
    <Table.DataCell>{tildeltSaksbehandlerNavn}</Table.DataCell>
    <Table.DataCell align="right">
      <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
    </Table.DataCell>
  </Table.Row>
);
