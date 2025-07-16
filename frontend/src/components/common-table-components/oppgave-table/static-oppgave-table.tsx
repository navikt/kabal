import { TableFooter } from '@app/components/common-table-components/footer';
import { OppgaveRows } from '@app/components/common-table-components/oppgave-rows/oppgave-rows';
import { TablePlainHeaders } from '@app/components/common-table-components/oppgave-table/oppgave-table-headers';
import { usePage } from '@app/components/common-table-components/oppgave-table/state/use-page';
import type { StaticOppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import type { ColumnKeyEnum } from '@app/components/common-table-components/types';
import type { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { DEFAULT_PAGE, useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { Table, type TableProps } from '@navikt/ds-react';
import { useEffect } from 'react';

interface CommonProps extends TableProps {
  columns: ColumnKeyEnum[];
  behandlinger: string[] | undefined;
  settingsKey: OppgaveTableRowsPerPage;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  'data-testid': string;
  resetPageOnLoad?: boolean;
}

interface WithPageStateProps extends CommonProps {
  tableKey: StaticOppgaveTableKey;
}

export const StaticOppgaveTableWithPageState = ({ tableKey, isLoading, ...props }: WithPageStateProps) => {
  const [initialPage, setPageQueryParam] = usePage(tableKey);

  return (
    <InternalStaticOppgaveTable
      {...props}
      isLoading={isLoading}
      initialPage={initialPage}
      setPageQueryParam={setPageQueryParam}
    />
  );
};

export const StaticOppgaveTable = (props: CommonProps) => <InternalStaticOppgaveTable {...props} />;

interface InternalProps extends CommonProps {
  initialPage?: number;
  setPageQueryParam?: (page: number) => void;
}

const InternalStaticOppgaveTable = ({
  columns,
  behandlinger,
  settingsKey,
  isLoading,
  isFetching,
  isError,
  refetch,
  initialPage,
  setPageQueryParam,
  resetPageOnLoad = false,
  ...rest
}: InternalProps): React.JSX.Element => {
  const { oppgaver, setPage, ...footerProps } = useOppgavePagination(settingsKey, behandlinger, initialPage);

  useEffect(() => {
    if (resetPageOnLoad && isLoading) {
      setPageQueryParam?.(DEFAULT_PAGE);
      setPage(DEFAULT_PAGE);
    }
  }, [isLoading, resetPageOnLoad, setPageQueryParam, setPage]);

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
          setPageQueryParam?.(page);
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
