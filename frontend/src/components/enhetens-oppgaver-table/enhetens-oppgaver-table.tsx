import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import 'nav-frontend-tabell-style';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsYtelser } from '../../hooks/use-settings-ytelser';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { IKlagebehandling, LoadKlagebehandlingerParams, useGetKlagebehandlingerQuery } from '../../redux-api/oppgaver';
import { Loader } from '../loader/loader';
import { TableHeaderFilters } from './filter-header';
import { Row } from './row';
import { StyledTable, StyledTableContainer } from './styled-components';
import { Filters } from './types';

const MAX_OPPGAVER = 100;

export const EnhetensOppgaverTable = () => {
  const [filters, setFilters] = useState<Filters>({
    types: [],
    ytelser: [],
    hjemler: [],
    sortDescending: false,
  });

  const settingsYtelser = useSettingsYtelser();
  const settingsTypes = useSettingsTypes();
  const settingsHjemler = useSettingsHjemler();

  const ytelser = filters.ytelser.length === 0 ? settingsYtelser.map(({ id }) => id) : filters.ytelser;
  const typer = filters.types.length === 0 ? settingsTypes.map(({ id }) => id) : filters.types;
  const hjemler = filters.hjemler.length === 0 ? settingsHjemler.map(({ id }) => id) : filters.hjemler;

  const { data: bruker } = useGetBrukerQuery();

  const queryParams: typeof skipToken | LoadKlagebehandlingerParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering: 'FRIST',
          rekkefoelge: filters.sortDescending ? 'SYNKENDE' : 'STIGENDE',
          erTildeltSaksbehandler: true,
          ytelser,
          typer,
          hjemler,
          navIdent: bruker.info.navIdent,
          projeksjon: 'UTVIDET',
          enhet: bruker.valgtEnhetView.id,
        };

  const { data: oppgaver } = useGetKlagebehandlingerQuery(queryParams, {
    pollingInterval: 30 * 1000,
  });

  return (
    <StyledTableContainer>
      <StyledTable className="tabell tabell--stripet" data-testid="enhetens-oppgaver-table">
        <TableHeaderFilters filters={filters} onChange={setFilters} />
        <OppgaveRader oppgaver={oppgaver?.klagebehandlinger} />
      </StyledTable>
    </StyledTableContainer>
  );
};

interface OppgaveRaderProps {
  oppgaver?: IKlagebehandling[];
}

const OppgaveRader = ({ oppgaver }: OppgaveRaderProps): JSX.Element => {
  if (typeof oppgaver === 'undefined') {
    return (
      <tbody>
        <tr>
          <td colSpan={100}>
            <Loader>Laster oppgaver...</Loader>
          </td>
        </tr>
      </tbody>
    );
  }

  if (oppgaver.length === 0) {
    return (
      <tbody data-testid="enhetens-oppgaver-table-none">
        <tr>
          <td colSpan={5}>Ingen oppgaver i liste</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody data-testid="enhetens-oppgaver-table-rows">
      {oppgaver.map((k) => (
        <Row {...k} key={k.id} />
      ))}
    </tbody>
  );
};
