import { Loader, Table } from '@navikt/ds-react';
import React from 'react';
import { IOppgaveList } from '../../types/oppgaver';
import { Row } from './row';

interface OppgaveRowsProps {
  oppgaver?: IOppgaveList;
  columnCount: number;
  isLoading: boolean;
  isError: boolean;
}

export const OppgaveRows = ({ oppgaver, columnCount, isLoading, isError }: OppgaveRowsProps): JSX.Element => {
  if (isError) {
    return (
      <Table.Body data-testid="mine-oppgaver-table-error">
        <Table.Row>
          <Table.DataCell colSpan={columnCount}>Kunne ikke laste oppgaver.</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  if (isLoading || typeof oppgaver === 'undefined') {
    return (
      <Table.Body data-testid="mine-oppgaver-table-loading">
        <Table.Row>
          <Table.DataCell colSpan={columnCount}>
            <Loader size="xlarge" title="Laster oppgaver..." />
          </Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  if (oppgaver.length === 0) {
    return (
      <Table.Body data-testid="mine-oppgaver-table-none">
        <Table.Row>
          <Table.DataCell colSpan={columnCount}>Ingen oppgaver i liste</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body data-testid="mine-oppgaver-table-rows">
      {oppgaver.map((k) => (
        <Row {...k} key={k.id} />
      ))}
    </Table.Body>
  );
};
