import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import 'nav-frontend-tabell-style';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import {
  LoadLedigeKlagebehandlingerParams,
  useGetAntallLedigeKlagebehandlingerMedUtgaatteFristerQuery,
  useGetLedigeKlagebehandlingerQuery,
} from '../../redux-api/oppgaver';
import { TableHeaderFilters } from './filter-header';
import { Pagination } from './pagination';
import { OppgaveRader } from './rows';
import {
  StyledFooter,
  StyledTable,
  StyledTableContainer,
  StyledTableFooter,
  StyledTableStats,
} from './styled-components';
import { Filters } from './types';

const PAGE_SIZE = 10;

export const OppgaveTable = (): JSX.Element => {
  const [filters, setFilters] = useState<Filters>({
    types: [],
    ytelser: [],
    hjemler: [],
    sortDescending: false,
  });
  const { data: bruker } = useGetBrukerQuery();

  const { page } = useParams();
  const parsedPage = parsePage(page);
  const currentPage = parsedPage === null ? 1 : parsedPage;
  const from = (currentPage - 1) * PAGE_SIZE;

  const ytelser = filters.ytelser.length === 0 ? [] : filters.ytelser;
  const typer = filters.types.length === 0 ? [] : filters.types;
  const hjemler = filters.hjemler.length === 0 ? [] : filters.hjemler;

  const queryParams: typeof skipToken | LoadLedigeKlagebehandlingerParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: from,
          antall: PAGE_SIZE,
          sortering: 'FRIST',
          rekkefoelge: filters.sortDescending ? 'SYNKENDE' : 'STIGENDE',
          ytelser,
          typer,
          hjemler,
          navIdent: bruker.info.navIdent,
          enhet: bruker.valgtEnhetView.id,
        };

  const {
    data: klagebehandlinger,
    refetch,
    isFetching,
  } = useGetLedigeKlagebehandlingerQuery(queryParams, {
    pollingInterval: 30 * 1000,
  });
  const { data: utgaatte } = useGetAntallLedigeKlagebehandlingerMedUtgaatteFristerQuery(queryParams, {
    pollingInterval: 300 * 1000,
  });

  useEffect(() => {
    refetch();
    return refetch;
  }, [refetch]);

  if (parsedPage === null) {
    return <Navigate to="../1" />;
  }

  const total = klagebehandlinger?.antallTreffTotalt ?? 0;

  if (!isFetching && typeof klagebehandlinger !== 'undefined' && total < from) {
    const lastPage = Math.ceil(total / PAGE_SIZE);
    return <Navigate to={`../${lastPage.toString()}`} />;
  }

  const fromNumber = from + 1;
  const toNumber = Math.min(total, from + PAGE_SIZE);

  return (
    <StyledTableContainer>
      <StyledTable className="tabell tabell--stripet" data-testid="oppgave-table">
        <TableHeaderFilters filters={filters} onChange={setFilters} />
        <OppgaveRader oppgaver={klagebehandlinger?.klagebehandlinger} columnCount={7} />
        <StyledTableFooter>
          <tr>
            <td colSpan={7}>
              <StyledFooter>
                <PageInfo total={total} fromNumber={fromNumber} toNumber={toNumber} />
                <Pagination total={total} pageSize={PAGE_SIZE} currentPage={currentPage} />
              </StyledFooter>
            </td>
          </tr>
        </StyledTableFooter>
      </StyledTable>

      <StyledTableStats>Antall oppgaver med utgåtte frister: {utgaatte?.antall ?? 0}</StyledTableStats>
    </StyledTableContainer>
  );
};

interface PageInfoProps {
  total: number;
  fromNumber: number;
  toNumber: number;
}

const PageInfo = ({ total, fromNumber, toNumber }: PageInfoProps): JSX.Element => {
  if (total === 0) {
    return <span>Ingen klagebehandlinger å vise</span>;
  }

  return <span>{`Viser ${fromNumber} til ${toNumber} av ${total} klagebehandlinger`}</span>;
};

const parsePage = (page = '1'): number | null => {
  const parsed = Number.parseInt(page, 10);
  return Number.isNaN(parsed) ? null : parsed;
};
