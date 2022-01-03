import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect } from 'react';
import 'nav-frontend-tabell-style';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useGetMineUferdigeOppgaverQuery } from '../../redux-api/oppgaver';
import { MineUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { TableHeader } from './header';
import { OppgaveRader } from './rows';
import { StyledTable, StyledTableContainer } from './styled-components';

const MAX_OPPGAVER = 100;

export const MineOppgaverTable = () => {
  const { data: bruker } = useGetBrukerQuery();

  const queryParams: typeof skipToken | MineUferdigeOppgaverParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering: SortFieldEnum.FRIST,
          rekkefoelge: SortOrderEnum.STIGENDE,
          navIdent: bruker.info.navIdent,
        };

  const { data: oppgaver, refetch } = useGetMineUferdigeOppgaverQuery(queryParams, {
    pollingInterval: 30 * 1000,
  });

  useEffect(() => {
    refetch();
    return refetch;
  }, [refetch]);

  const oppgaverHeaderTitles: (string | null)[] = [
    'Type',
    'Ytelse',
    'Hjemmel',
    'Navn',
    'Fnr.',
    'Alder',
    'Frist',
    null,
    null,
    null,
  ];

  return (
    <StyledTableContainer>
      <StyledTable className="tabell tabell--stripet" data-testid="mine-oppgaver-table">
        <TableHeader headers={oppgaverHeaderTitles} />
        <OppgaveRader oppgaver={oppgaver?.klagebehandlinger} columnCount={oppgaverHeaderTitles.length} />
      </StyledTable>
    </StyledTableContainer>
  );
};
