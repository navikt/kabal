import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React from 'react';
import 'nav-frontend-tabell-style';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { LoadKlagebehandlingerParams, useGetKlagebehandlingerQuery } from '../../redux-api/oppgaver';
import { TableHeader } from './header';
import { OppgaveRader } from './rows';
import { StyledCaption, StyledTable, StyledTableContainer } from './styled-components';

const MAX_OPPGAVER = 100;

export const MineOppgaverTable = () => {
  const { data: bruker } = useGetBrukerQuery();

  const queryParams: typeof skipToken | LoadKlagebehandlingerParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering: 'FRIST',
          rekkefoelge: 'STIGENDE',
          erTildeltSaksbehandler: true,
          temaer: [],
          typer: [],
          hjemler: [],
          navIdent: bruker.info.navIdent,
          tildeltSaksbehandler: bruker.info.navIdent,
          projeksjon: 'UTVIDET',
        };

  const { data: oppgaver } = useGetKlagebehandlingerQuery(queryParams, {
    pollingInterval: 30 * 1000,
  });

  const doneQueryParams: typeof skipToken | LoadKlagebehandlingerParams =
    queryParams === skipToken ? skipToken : { ...queryParams, ferdigstiltFom: new Date().toISOString().split('T')[0] };

  const { data: doneOppgaver } = useGetKlagebehandlingerQuery(doneQueryParams, {
    pollingInterval: 180 * 1000,
  });

  const oppgaverHeaderTitles: (string | null)[] = [
    'Type',
    'Tema',
    'Hjemmel',
    'Navn',
    'Fnr.',
    'Alder',
    'Frist',
    null,
    null,
    null,
  ];
  const doneOppgaverHeaderTitles: string[] = ['Type', 'Tema', 'Hjemmel', 'Navn', 'Fnr.', 'Fullført', 'Utfall'];

  return (
    <StyledTableContainer>
      <StyledTable className="tabell tabell--stripet">
        <TableHeader headers={oppgaverHeaderTitles} />
        <OppgaveRader oppgaver={oppgaver?.klagebehandlinger} columnCount={oppgaverHeaderTitles.length} />
      </StyledTable>
      <StyledTable className="tabell tabell--stripet">
        <StyledCaption>Fullførte oppgaver siste 7 dager</StyledCaption>
        <TableHeader headers={doneOppgaverHeaderTitles} />
        <OppgaveRader oppgaver={doneOppgaver?.klagebehandlinger} columnCount={doneOppgaverHeaderTitles.length} />
      </StyledTable>
    </StyledTableContainer>
  );
};
