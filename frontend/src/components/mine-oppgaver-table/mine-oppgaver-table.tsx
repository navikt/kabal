import { Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGetMineUferdigeOppgaverQuery } from '../../redux-api/oppgaver/queries/oppgaver';
import { useUser } from '../../simple-api-state/use-user';
import { MineUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { TableHeader } from './header';
import { OppgaveRader } from './rows';
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
    <StyledTable data-testid="mine-oppgaver-table" zebraStripes>
      <TableHeader filters={filters} onSortChange={(sortKey?: string) => {}} />
      <OppgaveRader oppgaver={oppgaver?.behandlinger} columnCount={10} isFetching={isFetching} />
    </StyledTable>

    // <StyledTable data-testid="mine-oppgaver-table">
    //   <TableHeader filters={filters} onChange={setFilters} />
    //   <OppgaveRader oppgaver={oppgaver?.behandlinger} columnCount={10} isFetching={isFetching} />
    // </StyledTable>
  );
};

const StyledTable = styled(Table)`
  width: 900px;
`;
