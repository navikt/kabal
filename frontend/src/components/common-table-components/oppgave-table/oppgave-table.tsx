import { TableFooter } from '@app/components/common-table-components/footer';
// See relevant-oppgaver.tsx for more information about this dependency cycle
import { OppgaveRows } from '@app/components/common-table-components/oppgave-rows/oppgave-rows';
import { TableFilterHeaders } from '@app/components/common-table-components/oppgave-table/oppgave-table-headers';
import type { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { usePage } from '@app/components/common-table-components/oppgave-table/use-page';
import type { SetParams } from '@app/components/common-table-components/oppgave-table/use-state';
import type { ColumnKeyEnum } from '@app/components/common-table-components/types';
import type { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import {
  type CommonOppgaverParams,
  SORT_FIELD_ENUM_VALUES,
  type SortFieldEnum,
  SortOrderEnum,
} from '@app/types/oppgaver';
import { type SortState, Table, type TableProps } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

interface Props extends TableProps {
  columns: ColumnKeyEnum[];
  behandlinger: string[] | undefined;
  settingsKey: OppgaveTableRowsPerPage;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  'data-testid': string;
  params: CommonOppgaverParams;
  setParams: SetParams;
  tableKey: OppgaveTableKey;
}

export const OppgaveTable = ({
  columns,
  params,
  setParams,
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
  const { sortering, rekkefoelge } = params;

  const sort: SortState = useMemo(
    () => ({
      orderBy: sortering,
      direction: rekkefoelge === SortOrderEnum.ASC ? TableSortDirection.ASC : TableSortDirection.DESC,
    }),
    [sortering, rekkefoelge],
  );

  const onSortChange = useCallback(
    (newSortering: string) => {
      if (isSortFieldEnum(newSortering)) {
        setParams('sortering', newSortering);
        setParams('rekkefoelge', newSortering === sortering ? invertSort(rekkefoelge) : SortOrderEnum.ASC);
      }
    },
    [setParams, rekkefoelge, sortering],
  );

  const { oppgaver, setPage, ...footerProps } = useOppgavePagination(settingsKey, behandlinger, initialPage);

  return (
    <Table {...rest} zebraStripes sort={sort} onSortChange={onSortChange}>
      <Table.Header data-testid={`${rest['data-testid']}-header`}>
        <Table.Row>
          <TableFilterHeaders columnKeys={columns} onSortChange={onSortChange} params={params} setParams={setParams} />
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

const isSortFieldEnum = (field: string | undefined): field is SortFieldEnum =>
  SORT_FIELD_ENUM_VALUES.includes(field as SortFieldEnum);

const invertSort = (order: SortOrderEnum) => (order === SortOrderEnum.ASC ? SortOrderEnum.DESC : SortOrderEnum.ASC);

enum TableSortDirection {
  ASC = 'ascending',
  DESC = 'descending',
  NONE = 'none',
}
