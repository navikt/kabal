import { Table, type TableProps } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { TableFooter } from '@/components/common-table-components/footer';
// biome-ignore lint/suspicious/noImportCycles: See relevant-oppgaver.tsx for more information about this dependency cycle.
import { OppgaveRows } from '@/components/common-table-components/oppgave-rows/oppgave-rows';
import { TablePlainHeaders } from '@/components/common-table-components/oppgave-table/oppgave-table-headers';
import { usePageQueryParam } from '@/components/common-table-components/oppgave-table/state/use-page';
import type { StaticOppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import type { ColumnKeyEnum } from '@/components/common-table-components/types';
import type { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { DEFAULT_PAGE, useOppgavePagination } from '@/hooks/use-oppgave-pagination';

interface CommonProps extends TableProps {
  columns: ColumnKeyEnum[];
  behandlinger: string[] | undefined;
  settingsKey: OppgaveTableRowsPerPage;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
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
      <Table.Header>
        <Table.Row>
          <TablePlainHeaders columnKeys={columns} />
        </Table.Row>
      </Table.Header>
      <OppgaveRows
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
      />
    </Table>
  );
};
