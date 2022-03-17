import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect } from 'react';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useGetMineVentendeOppgaverQuery } from '../../redux-api/oppgaver';
import { StyledCaption, StyledTable } from '../../styled-components/table';
import { MineUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { TableHeader } from '../common-table-components/header';
import { OppgaveRader } from './rows';

const MAX_OPPGAVER = 100;

const TABLE_HEADERS: (string | null)[] = ['Type', 'Ytelse', 'Hjemmel', 'Navn', 'Fnr.', 'På vent til', 'Utfall', null];

export const OppgaverPaaVentTable = () => {
  const { data: bruker } = useGetBrukerQuery();

  const queryParams: typeof skipToken | MineUferdigeOppgaverParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering: SortFieldEnum.FRIST,
          rekkefoelge: SortOrderEnum.STIGENDE,
          navIdent: bruker.navIdent,
        };

  const {
    data: oppgaver,
    refetch,
    isError,
    isLoading,
  } = useGetMineVentendeOppgaverQuery(queryParams, {
    pollingInterval: 30 * 1000,
  });

  useEffect(() => {
    refetch();
    return refetch;
  }, [refetch]);

  return (
    <StyledTable data-testid="oppgaver-paa-vent-table">
      <StyledCaption>Oppgaver på vent</StyledCaption>
      <TableHeader headers={TABLE_HEADERS} />
      <OppgaveRader
        oppgaver={oppgaver?.behandlinger}
        columnCount={TABLE_HEADERS.length}
        isLoading={isLoading}
        isError={isError}
      />
    </StyledTable>
  );
};
