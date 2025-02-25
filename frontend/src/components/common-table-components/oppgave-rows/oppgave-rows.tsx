import { LoadingRow } from '@app/components/common-table-components/loading-row';
import type { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { Table } from '@navikt/ds-react';
// See relevant-oppgaver.tsx for more information about this dependency cycle
import { OppgaveRow } from './oppgave-row';

interface OppgaveRowsProps {
  oppgaver: string[];
  columns: ColumnKeyEnum[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  'data-testid': string;
  pageSize: number;
}

export const OppgaveRows = ({
  oppgaver,
  columns,
  isLoading,
  isFetching,
  isError,
  'data-testid': testId,
  pageSize,
}: OppgaveRowsProps): React.JSX.Element => {
  if (isError) {
    return (
      <Table.Body data-testid={testId} data-state="error" data-empty="true">
        <Table.Row>
          <Table.DataCell colSpan={columns.length}>Kunne ikke laste oppgaver.</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  if (isLoading) {
    return (
      <Table.Body data-testid={testId} data-state="loading" data-empty="true">
        {new Array(pageSize)
          .fill(0)
          .map((_, i) => i)
          .map((i) => (
            <LoadingRow columnCount={columns.length} testId={`${testId}-row`} key={i} />
          ))}
      </Table.Body>
    );
  }

  const state = isFetching ? 'updating' : 'ready';

  if (oppgaver.length === 0) {
    return (
      <Table.Body data-testid={testId} data-state={state} data-empty="true">
        <Table.Row>
          <Table.DataCell colSpan={columns.length}>Ingen oppgaver</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body data-testid={testId} data-state={state} data-empty="false">
      {oppgaver.map((id) => (
        <OppgaveRow columns={columns} oppgaveId={id} testId={`${testId}-row`} key={id} />
      ))}
    </Table.Body>
  );
};
