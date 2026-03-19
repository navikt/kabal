import { type SortState, Table, type TableProps } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import { TableFooter } from '@/components/common-table-components/footer';
// See relevant-oppgaver.tsx for more information about this dependency cycle
import { OppgaveRows } from '@/components/common-table-components/oppgave-rows/oppgave-rows';
import { TableFilterHeaders } from '@/components/common-table-components/oppgave-table/oppgave-table-headers';
import { usePageQueryParam } from '@/components/common-table-components/oppgave-table/state/use-page';
import { useOppgaveTableSorting } from '@/components/common-table-components/oppgave-table/state/use-sort-state';
import type { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import type { ColumnKeyEnum } from '@/components/common-table-components/types';
import type { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useOppgavePagination } from '@/hooks/use-oppgave-pagination';
import { SORT_FIELD_ENUM_VALUES, type SortFieldEnum, SortOrderEnum } from '@/types/oppgaver';

interface Props extends TableProps {
  columns: ColumnKeyEnum[];
  behandlinger: string[] | undefined;
  settingsKey: OppgaveTableRowsPerPage;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  'data-testid': string;
  tableKey: OppgaveTableKey;
  defaultRekkefoelge: SortOrderEnum;
  defaultSortering: SortFieldEnum;
}

export const OppgaveTable = ({
  columns,
  behandlinger = [],
  settingsKey,
  isLoading,
  isFetching,
  isError,
  refetch,
  tableKey,
  defaultRekkefoelge,
  defaultSortering,
  ...rest
}: Props): React.JSX.Element => {
  const { sortField, sortOrder, setSortering } = useOppgaveTableSorting(tableKey, defaultSortering, defaultRekkefoelge);
  const [page, setPage] = usePageQueryParam(tableKey);

  const sort: SortState = useMemo(
    () => ({
      orderBy: sortField,
      direction: sortOrder === SortOrderEnum.ASC ? TableSortDirection.ASC : TableSortDirection.DESC,
    }),
    [sortField, sortOrder],
  );

  const onSortChange = useCallback(
    (newSortField: string) => {
      if (isSortFieldEnum(newSortField)) {
        setSortering(newSortField, newSortField === sortField ? invertSort(sortOrder) : SortOrderEnum.ASC);
      }
    },
    [sortOrder, sortField, setSortering],
  );

  const { oppgaver, ...footerProps } = useOppgavePagination(settingsKey, behandlinger, page);

  return (
    <Table {...rest} zebraStripes sort={sort} onSortChange={onSortChange}>
      <Table.Header data-testid={`${rest['data-testid']}-header`}>
        <Table.Row className="whitespace-nowrap">
          <TableFilterHeaders
            tableKey={tableKey}
            columnKeys={columns}
            sortering={sortField}
            rekkefoelge={sortOrder}
            onSortChange={onSortChange}
          />
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

const isSortFieldEnum = (field: string | undefined): field is SortFieldEnum =>
  SORT_FIELD_ENUM_VALUES.includes(field as SortFieldEnum);

const invertSort = (order: SortOrderEnum) => (order === SortOrderEnum.ASC ? SortOrderEnum.DESC : SortOrderEnum.ASC);

enum TableSortDirection {
  ASC = 'ascending',
  DESC = 'descending',
  NONE = 'none',
}
