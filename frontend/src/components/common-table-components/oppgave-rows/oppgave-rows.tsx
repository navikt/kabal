import { Table } from '@navikt/ds-react';
import { LoadingRow } from '@/components/common-table-components/loading-row';
// See relevant-oppgaver.tsx for more information about this dependency cycle
import { OppgaveRow } from '@/components/common-table-components/oppgave-rows/oppgave-row';
import type { ColumnKeyEnum } from '@/components/common-table-components/types';

interface OppgaveRowsProps {
  oppgaver: string[];
  columns: ColumnKeyEnum[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  pageSize: number;
}

export const OppgaveRows = ({
  oppgaver,
  columns,
  isLoading,
  isFetching,
  isError,
  pageSize,
}: OppgaveRowsProps): React.JSX.Element => {
  if (isError) {
    return (
      <Table.Body aria-busy={false}>
        <Table.Row>
          <Table.DataCell colSpan={columns.length}>Kunne ikke laste oppgaver.</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  if (isLoading) {
    return (
      <Table.Body aria-busy={true}>
        {new Array(pageSize)
          .fill(0)
          .map((_, i) => i)
          .map((i) => (
            <LoadingRow columnCount={columns.length} key={i} />
          ))}
      </Table.Body>
    );
  }

  if (oppgaver.length === 0) {
    return (
      <Table.Body aria-busy={isFetching}>
        <Table.Row>
          <Table.DataCell colSpan={columns.length}>Ingen oppgaver</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body aria-busy={isFetching}>
      {oppgaver.map((id) => (
        <OppgaveRow columns={columns} oppgaveId={id} key={id} />
      ))}
    </Table.Body>
  );
};
