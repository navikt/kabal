import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect } from 'react';
import 'nav-frontend-tabell-style';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { LoadTildelteKlagebehandlingerParams, useGetTildelteKlagebehandlingerQuery } from '../../redux-api/oppgaver';
import { TableHeader } from './header';
import { OppgaveRader } from './rows';
import { StyledCaption, StyledTable, StyledTableContainer } from './styled-components';

const MAX_OPPGAVER = 100;

export const FullfoerteOppgaverTable = () => {
  const { data: bruker } = useGetBrukerQuery();

  const queryParams: typeof skipToken | LoadTildelteKlagebehandlingerParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering: 'FRIST',
          rekkefoelge: 'SYNKENDE',
          navIdent: bruker.info.navIdent,
          tildeltSaksbehandler: [bruker.info.navIdent],
          ferdigstiltDaysAgo: 7,
          projeksjon: 'UTVIDET',
          enhet: bruker.valgtEnhetView.id,
        };

  const { data: doneOppgaver, refetch } = useGetTildelteKlagebehandlingerQuery(queryParams, {
    pollingInterval: 180 * 1000,
  });

  useEffect(() => {
    refetch();
    return refetch;
  }, [refetch]);

  const doneOppgaverHeaderTitles: (string | null)[] = [
    'Type',
    'Ytelse',
    'Hjemmel',
    'Navn',
    'Fnr.',
    'Fullført',
    'Utfall',
    null,
  ];

  return (
    <StyledTableContainer>
      <StyledTable className="tabell tabell--stripet">
        <StyledCaption>Fullførte oppgaver siste 7 dager</StyledCaption>
        <TableHeader headers={doneOppgaverHeaderTitles} />
        <OppgaveRader oppgaver={doneOppgaver?.klagebehandlinger} columnCount={doneOppgaverHeaderTitles.length} />
      </StyledTable>
    </StyledTableContainer>
  );
};
