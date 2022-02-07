import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect, useState } from 'react';
import 'nav-frontend-tabell-style';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsYtelser } from '../../hooks/use-settings-ytelser';
import { IEnhet, useGetBrukerQuery } from '../../redux-api/bruker';
import { useGetEnhetensUferdigeOppgaverQuery } from '../../redux-api/oppgaver';
import { EnhetensUferdigeOppgaverParams, IOppgaveList, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { Loader } from '../loader/loader';
import { TableHeaderFilters } from './filter-header';
import { Row } from './row';
import { StyledHeader, StyledTable, StyledTableContainer } from './styled-components';
import { Filters } from './types';

const MAX_OPPGAVER = 100;

interface EnhetensOppgaverTableProps {
  enhet: IEnhet;
}

export const EnhetensOppgaverTable = ({ enhet }: EnhetensOppgaverTableProps) => {
  const [filters, setFilters] = useState<Filters>({
    types: [],
    ytelser: [],
    hjemler: [],
    tildeltSaksbehandler: [],
    sortDescending: false,
  });

  const settingsYtelser = useSettingsYtelser();
  const settingsTypes = useSettingsTypes();
  const settingsHjemler = useSettingsHjemler();

  const ytelser = filters.ytelser.length === 0 ? settingsYtelser.map(({ id }) => id) : filters.ytelser;
  const typer = filters.types.length === 0 ? settingsTypes.map(({ id }) => id) : filters.types;
  const hjemler = filters.hjemler.length === 0 ? settingsHjemler.map(({ id }) => id) : filters.hjemler;

  const { data: bruker } = useGetBrukerQuery();

  const queryParams: typeof skipToken | EnhetensUferdigeOppgaverParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering: SortFieldEnum.FRIST,
          rekkefoelge: filters.sortDescending ? SortOrderEnum.SYNKENDE : SortOrderEnum.STIGENDE,
          ytelser,
          typer,
          hjemler,
          enhetId: enhet.id,
          tildelteSaksbehandlere: filters.tildeltSaksbehandler,
        };

  const { data: oppgaver, refetch } = useGetEnhetensUferdigeOppgaverQuery(queryParams, {
    pollingInterval: 30 * 1000,
  });

  useEffect(() => {
    refetch();
    return refetch;
  }, [refetch]);

  return (
    <StyledTableContainer>
      <StyledHeader>Tildelte oppgaver - {enhet.navn}</StyledHeader>
      <StyledTable className="tabell tabell--stripet" data-testid="enhetens-oppgaver-table">
        <TableHeaderFilters filters={filters} onChange={setFilters} enhetId={enhet.id} />
        <OppgaveRader oppgaver={oppgaver?.behandlinger} />
      </StyledTable>
    </StyledTableContainer>
  );
};

interface OppgaveRaderProps {
  oppgaver?: IOppgaveList;
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
