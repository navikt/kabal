import { TableFooter } from '@app/components/common-table-components/footer';
import { OppgaveRows } from '@app/components/common-table-components/oppgave-rows/oppgave-rows';
import { TablePlainHeaders } from '@app/components/common-table-components/oppgave-table/oppgave-table-headers';
import type { StaticOppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { usePage } from '@app/components/common-table-components/oppgave-table/use-page';
import type { ColumnKeyEnum } from '@app/components/common-table-components/types';
import type { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { Table, type TableProps } from '@navikt/ds-react';

interface Props extends TableProps {
  columns: ColumnKeyEnum[];
  behandlinger: string[] | undefined;
  settingsKey: OppgaveTableRowsPerPage;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  'data-testid': string;
  tableKey: StaticOppgaveTableKey;
}

export const StaticOppgaveTable = ({
  columns,
  behandlinger,
  settingsKey,
  isLoading,
  isFetching,
  isError,
  refetch,
  tableKey,
  ...rest
}: Props): React.JSX.Element => {
  const [initialPage, setPageQueryParam] = usePage(tableKey);

  const { oppgaver, setPage, ...footerProps } = useOppgavePagination(settingsKey, behandlinger, initialPage);

  return (
    <Table {...rest} zebraStripes>
      <Table.Header data-testid={`${rest['data-testid']}-header`}>
        <Table.Row>
          <TablePlainHeaders columnKeys={columns} />
        </Table.Row>
      </Table.Header>
      <OppgaveRows
        data-testid={`${rest['data-testid']}-rows`}
        oppgaver={oppgaver}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        pageSize={footerProps.pageSize}
      />
      <TableFooter
        {...footerProps}
        setPage={(page) => {
          setPageQueryParam(page);
          setPage(page);
        }}
        columnCount={columns.length}
        onRefresh={refetch}
        isLoading={isLoading}
        isFetching={isFetching}
        settingsKey={settingsKey}
        data-testid={`${rest['data-testid']}-footer`}
      />
    </Table>
  );
};
