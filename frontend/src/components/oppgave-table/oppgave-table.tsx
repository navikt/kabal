import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import 'nav-frontend-tabell-style';
import {
  LoadKlagebehandlingerParams,
  useGetAntallKlagebehandlingerMedUtgaatteFristerQuery,
  useGetKlagebehandlingerQuery,
} from '../../redux-api/oppgaver';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { TableHeaderFilters } from './filter-header';
import { Filters } from './types';
import { Pagination } from './pagination';
import {
  StyledFooter,
  StyledTableContainer,
  StyledTableFooter,
  StyledTableStats,
  StyledTable,
} from './styled-components';
import { OppgaveRader } from './rows';

interface OppgaveTableParams {
  page: string;
}

const PAGE_SIZE = 10;

export const OppgaveTable: React.FC<OppgaveTableParams> = ({ page }: OppgaveTableParams) => {
  const [filters, setFilters] = useState<Filters>({
    types: [],
    tema: [],
    hjemler: [],
    sortDescending: false,
  });
  const { data: userData } = useGetBrukerQuery();

  const currentPage = parsePage(page);
  const from = (currentPage - 1) * PAGE_SIZE;

  const queryParams: typeof skipToken | LoadKlagebehandlingerParams =
    typeof userData === 'undefined'
      ? skipToken
      : {
          start: from,
          antall: PAGE_SIZE,
          sortering: 'FRIST',
          rekkefoelge: filters.sortDescending ? 'SYNKENDE' : 'STIGENDE',
          erTildeltSaksbehandler: false,
          temaer: filters.tema,
          typer: filters.types,
          hjemler: filters.hjemler,
          navIdent: userData.info.navIdent,
        };

  const { data: klagebehandlinger } = useGetKlagebehandlingerQuery(queryParams, {
    pollingInterval: 3 * 1000,
  });
  const { data: utgaatte } = useGetAntallKlagebehandlingerMedUtgaatteFristerQuery(queryParams, {
    pollingInterval: 300 * 1000,
  });

  const total = klagebehandlinger?.antallTreffTotalt ?? 0;

  if (total < from) {
    const lastPage = Math.ceil(total / PAGE_SIZE);
    return <Redirect to={lastPage.toString()} />;
  }

  const fromNumber = from + 1;
  const toNumber = Math.min(total, from + PAGE_SIZE);

  return (
    <StyledTableContainer>
      <StyledTable className="tabell tabell--stripet">
        <TableHeaderFilters filters={filters} onChange={setFilters} />
        <OppgaveRader oppgaver={klagebehandlinger?.klagebehandlinger} columnCount={7} />
        <StyledTableFooter>
          <tr>
            <td colSpan={7}>
              <StyledFooter>
                <span>{`Viser ${fromNumber} til ${toNumber} av ${total} klagebehandlinger`}</span>
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

const parsePage = (page: string): number => {
  const parsed = Number.parseInt(page, 10);
  return Number.isNaN(parsed) ? 1 : parsed;
};
