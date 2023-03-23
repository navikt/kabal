import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React from 'react';
import { useGetMineVentendeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { StyledCaption, StyledMineOppgaverTable } from '@app/styled-components/table';
import { MineUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { TableHeader } from '../common-table-components/header';
import { OppgaveRows } from './rows';

const MAX_OPPGAVER = 100;

const TABLE_HEADERS: (string | null)[] = ['Type', 'Ytelse', 'Hjemmel', 'Navn', 'Fnr.', 'På vent til', 'Utfall', null];

export const OppgaverPaaVentTable = () => {
  const { data: bruker } = useUser();

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
    isError,
    isLoading,
  } = useGetMineVentendeOppgaverQuery(queryParams, {
    pollingInterval: 30 * 1000,
    refetchOnMountOrArgChange: true,
  });

  return (
    <StyledMineOppgaverTable data-testid="oppgaver-paa-vent-table" zebraStripes>
      <StyledCaption>Oppgaver på vent</StyledCaption>
      <TableHeader headers={TABLE_HEADERS} />
      <OppgaveRows
        oppgaver={oppgaver?.behandlinger}
        columnCount={TABLE_HEADERS.length}
        isLoading={isLoading}
        isError={isError}
      />
    </StyledMineOppgaverTable>
  );
};
