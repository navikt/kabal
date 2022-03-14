import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect, useState } from 'react';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsYtelser } from '../../hooks/use-settings-ytelser';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useGetEnhetensUferdigeOppgaverQuery } from '../../redux-api/oppgaver';
import { StyledCaption, StyledTable } from '../../styled-components/table';
import { EnhetensUferdigeOppgaverParams, IOppgaveList, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { Loader } from '../loader/loader';
import { TableHeaderFilters } from './filter-header';
import { Row } from './row';
import { Filters } from './types';

const MAX_OPPGAVER = 100;

export const EnhetensOppgaverTable = () => {
  const [filters, setFilters] = useState<Filters>({
    types: [],
    ytelser: [],
    hjemler: [],
    tildeltSaksbehandler: [],
    sorting: [SortFieldEnum.FRIST, SortOrderEnum.STIGENDE],
  });

  const settingsYtelser = useSettingsYtelser();
  const settingsTypes = useSettingsTypes();
  const settingsHjemler = useSettingsHjemler();

  const ytelser = filters.ytelser.length === 0 ? settingsYtelser.map(({ id }) => id) : filters.ytelser;
  const typer = filters.types.length === 0 ? settingsTypes.map(({ id }) => id) : filters.types;
  const hjemler = filters.hjemler.length === 0 ? settingsHjemler.map(({ id }) => id) : filters.hjemler;
  const [sortering, rekkefoelge] = filters.sorting;

  const { data: bruker } = useGetBrukerQuery();

  const queryParams: typeof skipToken | EnhetensUferdigeOppgaverParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering,
          rekkefoelge,
          ytelser,
          typer,
          hjemler,
          enhetId: bruker.ansattEnhet.id,
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
    <StyledTable data-testid="enhetens-oppgaver-table">
      <StyledCaption>Tildelte oppgaver - {bruker?.ansattEnhet.navn}</StyledCaption>
      <TableHeaderFilters filters={filters} onChange={setFilters} />
      <OppgaveRader oppgaver={oppgaver?.behandlinger} />
    </StyledTable>
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
