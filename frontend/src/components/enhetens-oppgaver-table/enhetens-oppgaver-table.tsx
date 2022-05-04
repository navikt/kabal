import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect, useState } from 'react';
import { useAvailableHjemler } from '../../hooks/use-available-hjemler';
import { useAvailableYtelser } from '../../hooks/use-available-ytelser';
import { useKodeverkValue } from '../../hooks/use-kodeverk-value';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useGetEnhetensUferdigeOppgaverQuery } from '../../redux-api/oppgaver';
import { StyledCaption, StyledTable } from '../../styled-components/table';
import { EnhetensUferdigeOppgaverParams, IOppgaveList, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
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

  const types = useKodeverkValue('sakstyper');
  const availableYtelser = useAvailableYtelser();
  const availableHjemler = useAvailableHjemler();

  const typer = filters.types.length === 0 ? types?.map(({ id }) => id) : filters.types;
  const ytelser = filters.ytelser.length === 0 ? availableYtelser.map(({ id }) => id) : filters.ytelser;
  const hjemler = filters.hjemler.length === 0 ? availableHjemler.map(({ id }) => id) : filters.hjemler;
  const [sortering, rekkefoelge] = filters.sorting;

  const { data: bruker } = useGetBrukerQuery();

  const queryParams: typeof skipToken | EnhetensUferdigeOppgaverParams =
    typeof bruker === 'undefined' || typeof types === 'undefined'
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
            <Loader size="xlarge" title="Laster oppgaver..." />
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
