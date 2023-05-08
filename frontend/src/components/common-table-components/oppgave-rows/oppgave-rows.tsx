import { Table } from '@navikt/ds-react';
import React from 'react';
import { LoadingRow } from '@app/components/common-table-components/loading-row';
import { OppgaveRow } from './oppgave-row';
import { ColumnKeyEnum } from './types';

interface OppgaveRowsProps {
  oppgaver: string[];
  columns: ColumnKeyEnum[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  testId: string;
  pageSize: number;
}

export const OppgaveRows = ({
  oppgaver,
  columns,
  isLoading,
  isFetching,
  isError,
  testId,
  pageSize,
}: OppgaveRowsProps): JSX.Element => {
  if (isError) {
    return (
      <Table.Body data-testid={`${testId}-rows`} data-state="error">
        <Table.Row>
          <Table.DataCell colSpan={columns.length}>Kunne ikke laste oppgaver.</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  if (isLoading) {
    return (
      <Table.Body data-testid={`${testId}-rows`} data-state="loading">
        {new Array(pageSize).fill(0).map((_, i) => (
          <LoadingRow columnCount={columns.length} testId={testId} key={i} />
        ))}
      </Table.Body>
    );
  }

  if (oppgaver.length === 0) {
    return (
      <Table.Body data-testid={`${testId}-rows`} data-state="empty">
        <Table.Row>
          <Table.DataCell colSpan={columns.length}>Ingen oppgaver</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body data-testid={`${testId}-rows`} data-state={isFetching ? 'updating' : 'ready'}>
      {oppgaver.map((id) => (
        <OppgaveRow columns={columns} oppgaveId={id} testId={testId} key={id} />
      ))}
    </Table.Body>
  );
};
