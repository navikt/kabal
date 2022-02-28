import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect } from 'react';
import 'nav-frontend-tabell-style';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useGetMineFerdigstilteOppgaverQuery } from '../../redux-api/oppgaver';
import { MineFerdigstilteOppgaverParams, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { TableHeader } from './header';
import { OppgaveRader } from './rows';
import { StyledCaption, StyledTable, StyledTableContainer } from './styled-components';

const MAX_OPPGAVER = 100;

const TABLE_HEADERS: (string | null)[] = ['Type', 'Ytelse', 'Hjemmel', 'Navn', 'Fnr.', 'Fullført', 'Utfall', null];

export const FullfoerteOppgaverTable = () => {
  const { data: bruker } = useGetBrukerQuery();

  const queryParams: typeof skipToken | MineFerdigstilteOppgaverParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering: SortFieldEnum.FRIST,
          rekkefoelge: SortOrderEnum.SYNKENDE,
          navIdent: bruker.info.navIdent,
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
    <StyledTableContainer>
      <StyledTable className="tabell tabell--stripet" data-testid="fullfoerte-oppgaver-table">
        <StyledCaption>Fullførte oppgaver siste 7 dager</StyledCaption>
        <TableHeader headers={TABLE_HEADERS} />
        <OppgaveRader oppgaver={doneOppgaver?.behandlinger} columnCount={TABLE_HEADERS.length} />
      </StyledTable>
    </StyledTableContainer>
  );
};
