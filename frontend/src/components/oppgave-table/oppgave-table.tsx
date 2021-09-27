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
import { useSettingsTemaer } from '../../hooks/use-settings-temaer';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';

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

  const settingsTemaer = useSettingsTemaer();
  const settingsTypes = useSettingsTypes();
  const settingsHjemler = useSettingsHjemler();

  const temaer = filters.tema.length === 0 ? settingsTemaer.map(({ id }) => id) : filters.tema;
  const typer = filters.types.length === 0 ? settingsTypes.map(({ id }) => id) : filters.types;
  const hjemler = filters.hjemler.length === 0 ? settingsHjemler.map(({ id }) => id) : filters.hjemler;

  const queryParams: typeof skipToken | LoadKlagebehandlingerParams =
    typeof userData === 'undefined'
      ? skipToken
      : {
          start: from,
          antall: PAGE_SIZE,
          sortering: 'FRIST',
          rekkefoelge: filters.sortDescending ? 'SYNKENDE' : 'STIGENDE',
          erTildeltSaksbehandler: false,
          temaer,
          typer,
          hjemler,
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

const PageInfo: React.FC<PageInfoProps> = ({ total, fromNumber, toNumber }) => {
  if (total === 0) {
    return <span>Ingen klagebehandlinger å vise</span>;
  }
  return <span>{`Viser ${fromNumber} til ${toNumber} av ${total} klagebehandlinger`}</span>;
};

const parsePage = (page: string): number => {
  const parsed = Number.parseInt(page, 10);
  return Number.isNaN(parsed) ? 1 : parsed;
};
