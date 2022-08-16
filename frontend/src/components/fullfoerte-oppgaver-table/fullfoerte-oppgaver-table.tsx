import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect } from 'react';
import { useGetMineFerdigstilteOppgaverQuery } from '../../redux-api/oppgaver/queries/oppgaver';
import { useUser } from '../../simple-api-state/use-user';
import { StyledCaption, StyledMineOppgaverTable } from '../../styled-components/table';
import { MineFerdigstilteOppgaverParams, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { TableHeader } from '../common-table-components/header';
import { OppgaveRows } from './rows';

const MAX_OPPGAVER = 100;

const TABLE_HEADERS: (string | null)[] = ['Type', 'Ytelse', 'Hjemmel', 'Navn', 'Fnr.', 'Fullført', 'Utfall', null];

export const FullfoerteOppgaverTable = () => {
  const { data: bruker } = useUser();

  const queryParams: typeof skipToken | MineFerdigstilteOppgaverParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering: SortFieldEnum.FRIST,
          rekkefoelge: SortOrderEnum.SYNKENDE,
          navIdent: bruker.navIdent,
          ferdigstiltDaysAgo: 7,
        };

  const { data: doneOppgaver, refetch } = useGetMineFerdigstilteOppgaverQuery(queryParams, {
    pollingInterval: 180 * 1000,
  });

  useEffect(() => {
    refetch();

    return refetch;
  }, [refetch]);

  return (
    <StyledMineOppgaverTable className="tabell tabell--stripet" data-testid="fullfoerte-oppgaver-table" zebraStripes>
      <StyledCaption>Fullførte oppgaver siste 7 dager</StyledCaption>
      <TableHeader headers={TABLE_HEADERS} />
      <OppgaveRows oppgaver={doneOppgaver?.behandlinger} columnCount={TABLE_HEADERS.length} />
    </StyledMineOppgaverTable>
  );
};
