import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect, useState } from 'react';
import 'nav-frontend-tabell-style';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useGetMineUferdigeOppgaverQuery } from '../../redux-api/oppgaver';
import { MineUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { TableHeader } from './header';
import { OppgaveRader } from './rows';
import { StyledTable, StyledTableContainer } from './styled-components';
import { Filters } from './types';

const MAX_OPPGAVER = 100;

export const MineOppgaverTable = () => {
  const [filters, setFilters] = useState<Filters>({
    sorting: [SortFieldEnum.FRIST, SortOrderEnum.STIGENDE],
  });
  const { data: bruker } = useGetBrukerQuery();

  const [sortering, rekkefoelge] = filters.sorting;

  const queryParams: typeof skipToken | MineUferdigeOppgaverParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering,
          rekkefoelge,
          navIdent: bruker.info.navIdent,
        };

  const {
    data: oppgaver,
    refetch,
    isFetching,
  } = useGetMineUferdigeOppgaverQuery(queryParams, {
    pollingInterval: 30 * 1000,
  });

  useEffect(() => {
    refetch();
    return refetch;
  }, [refetch]);

  return (
    <StyledTableContainer>
      <StyledTable className="tabell tabell--stripet" data-testid="mine-oppgaver-table">
        <TableHeader filters={filters} onChange={setFilters} />
        <OppgaveRader oppgaver={oppgaver?.behandlinger} columnCount={10} isFetching={isFetching} />
      </StyledTable>
    </StyledTableContainer>
  );
};
