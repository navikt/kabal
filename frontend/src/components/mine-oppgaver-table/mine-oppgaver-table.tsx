import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import { TableFooter } from '@app/components/common-table-components/footer';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { useGetMineUferdigeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { StyledMineOppgaverTable } from '@app/styled-components/table';
import { MineUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { OppgaveRows } from '../common-table-components/oppgave-rows/oppgave-rows';
import { ColumnKeyEnum } from '../common-table-components/oppgave-rows/types';
import { TableHeader } from './header';
import { Filters } from './types';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Navn,
  ColumnKeyEnum.Fnr,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.Medunderskriverflyt,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Oppgavestyring,
];

export const MineOppgaverTable = () => {
  const [filters, setFilters] = useState<Filters>({
    sorting: [SortFieldEnum.FRIST, SortOrderEnum.STIGENDE],
  });
  const { data: bruker, isLoading: isLoadingUser, isError: isErrorUser } = useUser();

  const [sortering, rekkefoelge] = filters.sorting;

  const queryParams: typeof skipToken | MineUferdigeOppgaverParams =
    typeof bruker === 'undefined' ? skipToken : { sortering, rekkefoelge };

  const { data, isError, isLoading, isFetching, refetch } = useGetMineUferdigeOppgaverQuery(queryParams);

  const { oppgaver, ...footerProps } = useOppgavePagination(
    OppgaveTableRowsPerPage.MINE_UFERDIGE,
    data?.behandlinger ?? []
  );

  return (
    <>
      <StyledMineOppgaverTable
        data-testid="mine-oppgaver-table"
        zebraStripes
        sort={{
          orderBy: filters.sorting[0],
          direction: filters.sorting[1] === SortOrderEnum.STIGENDE ? 'ascending' : 'descending',
        }}
        onSortChange={(field?: string) => {
          if (field === SortFieldEnum.FRIST || field === SortFieldEnum.ALDER || field === SortFieldEnum.MOTTATT) {
            const [currentField, currentOrder] = filters.sorting;

            const order = currentField === field ? invertSort(currentOrder) : SortOrderEnum.STIGENDE;

            setFilters({ sorting: [field, order] });
          }
        }}
      >
        <TableHeader />
        <OppgaveRows
          testId="mine-oppgaver-table"
          oppgaver={oppgaver}
          columns={COLUMNS}
          pageSize={footerProps.pageSize}
          isError={isError || isErrorUser}
          isLoading={isLoading || isLoadingUser}
          isFetching={isFetching}
        />
        <TableFooter
          {...footerProps}
          columnCount={10}
          settingsKey={OppgaveTableRowsPerPage.MINE_UFERDIGE}
          onRefresh={refetch}
          isLoading={isLoading || isFetching}
          testId="mine-oppgaver-table-footer"
        />
      </StyledMineOppgaverTable>
    </>
  );
};

const invertSort = (order: SortOrderEnum) =>
  order === SortOrderEnum.STIGENDE ? SortOrderEnum.SYNKENDE : SortOrderEnum.STIGENDE;
