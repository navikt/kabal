import { TableFooter } from '@app/components/common-table-components/footer';
import { OppgaveRows } from '@app/components/common-table-components/oppgave-rows/oppgave-rows';
import { TablePlainHeaders } from '@app/components/common-table-components/oppgave-table/oppgave-table-headers';
import { usePageQueryParam } from '@app/components/common-table-components/oppgave-table/state/use-page';
import type { StaticOppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import type { ColumnKeyEnum } from '@app/components/common-table-components/types';
import type { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { DEFAULT_PAGE, useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { Table, type TableProps } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

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
  const [page, setPage] = usePageQueryParam(tableKey);

  return <InternalStaticOppgaveTable {...props} isLoading={isLoading} page={page} setPage={setPage} />;
};

export const StaticOppgaveTable = (props: CommonProps) => {
  const [page, setPage] = useState(DEFAULT_PAGE);

  return <InternalStaticOppgaveTable {...props} page={page} setPage={setPage} />;
};

interface InternalProps extends CommonProps {
  page: number;
  setPage: (page: number) => void;
}

const InternalStaticOppgaveTable = ({
  columns,
  behandlinger = [],
  settingsKey,
  isLoading,
  isFetching,
  isError,
  refetch,
  page,
  setPage,
  resetPageOnLoad = false,
  ...rest
}: InternalProps): React.JSX.Element => {
  const { oppgaver, ...footerProps } = useOppgavePagination(settingsKey, behandlinger, page);

  useEffect(() => {
    if (resetPageOnLoad && isLoading) {
      setPage(DEFAULT_PAGE);
    }
  }, [isLoading, resetPageOnLoad, setPage]);

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
        setPage={setPage}
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
