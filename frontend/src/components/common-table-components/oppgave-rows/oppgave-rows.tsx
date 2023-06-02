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
      <Table.Body data-testid={`${testId}-rows`} data-state="error" data-empty="true">
        <Table.Row>
          <Table.DataCell colSpan={columns.length}>Kunne ikke laste oppgaver.</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  if (isLoading) {
    return (
      <Table.Body data-testid={`${testId}-rows`} data-state="loading" data-empty="true">
        {new Array(pageSize).fill(0).map((_, i) => (
          <LoadingRow columnCount={columns.length} testId={`${testId}-row`} key={i} />
        ))}
      </Table.Body>
    );
  }

  const state = isFetching ? 'updating' : 'ready';

  if (oppgaver.length === 0) {
    return (
      <Table.Body data-testid={`${testId}-rows`} data-state={state} data-empty="true">
        <Table.Row>
          <Table.DataCell colSpan={columns.length}>Ingen oppgaver</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body data-testid={`${testId}-rows`} data-state={state} data-empty="false">
      {oppgaver.map((id) => (
        <OppgaveRow columns={columns} oppgaveId={id} testId={`${testId}-row`} key={id} />
      ))}
    </Table.Body>
  );
};
