import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import { useGetMineUferdigeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { StyledMineOppgaverTable } from '@app/styled-components/table';
import { MineUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { TableHeader } from './header';
import { Oppgaverader } from './rows';
import { Filters } from './types';

const MAX_OPPGAVER = 100;

export const MineOppgaverTable = () => {
  const [filters, setFilters] = useState<Filters>({
    sorting: [SortFieldEnum.FRIST, SortOrderEnum.STIGENDE],
  });
  const { data: bruker } = useUser();

  const [sortering, rekkefoelge] = filters.sorting;

  const queryParams: typeof skipToken | MineUferdigeOppgaverParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering,
          rekkefoelge,
          navIdent: bruker.navIdent,
        };

  const { data: oppgaver, isFetching } = useGetMineUferdigeOppgaverQuery(queryParams, {
    pollingInterval: 30 * 1000,
    refetchOnMountOrArgChange: true,
  });

  return (
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

          setFilters({
            sorting: [field, order],
          });
        }
      }}
    >
      <TableHeader />
      <Oppgaverader oppgaver={oppgaver?.behandlinger} columnCount={10} isFetching={isFetching} />
    </StyledMineOppgaverTable>
  );
};

const invertSort = (order: SortOrderEnum) =>
  order === SortOrderEnum.STIGENDE ? SortOrderEnum.SYNKENDE : SortOrderEnum.STIGENDE;
