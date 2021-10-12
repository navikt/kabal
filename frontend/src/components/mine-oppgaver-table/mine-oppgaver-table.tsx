import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { Checkbox } from 'nav-frontend-skjema';
import React, { useState } from 'react';
import 'nav-frontend-tabell-style';
import styled from 'styled-components';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { LoadKlagebehandlingerParams, useGetKlagebehandlingerQuery } from '../../redux-api/oppgaver';
import { TableHeader } from './header';
import { OppgaveRader } from './rows';
import { StyledTable, StyledTableContainer } from './styled-components';

const MAX_OPPGAVER = 100;

export const MineOppgaverTable = () => {
  const { data: bruker } = useGetBrukerQuery();
  const [showOnlyMedunderskriver, setShowOnlyMedunderskriver] = useState<boolean>(false);

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

  return (
    <StyledTableContainer>
      <StyledSettings>
        <Checkbox
          label="Vis kun dine medunderskriversaker"
          onChange={({ target }) => setShowOnlyMedunderskriver(target.checked)}
        />
      </StyledSettings>
      <StyledTable className="tabell tabell--stripet">
        <TableHeader headers={oppgaverHeaderTitles} />
        <OppgaveRader
          oppgaver={oppgaver?.klagebehandlinger}
          columnCount={oppgaverHeaderTitles.length}
          showOnlyMedunderskriver={showOnlyMedunderskriver}
        />
      </StyledTable>
    </StyledTableContainer>
  );
};

const StyledSettings = styled.div`
  margin: 20px;
`;
