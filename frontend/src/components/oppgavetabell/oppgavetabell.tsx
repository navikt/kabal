import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import 'nav-frontend-tabell-style';
import {
  IKlagebehandling,
  LoadKlagebehandlingerParams,
  useGetAntallKlagebehandlingerMedUtgaatteFristerQuery,
  useGetKlagebehandlingerQuery,
} from '../../redux-api/oppgaver';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { TableHeaderFilters } from './filter-header';
import { Filters } from './types';
import { Pagination } from './pagination';
import { Row } from './row';
import { SCFooter, SCTableContainer, SCTableFooter, SCTableStats, StyledTable } from './styled-components';

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
  const { data: bruker } = useGetBrukerQuery();

  const currentPage = parsePage(page);
  const from = (currentPage - 1) * PAGE_SIZE;

  const queryParams: typeof skipToken | LoadKlagebehandlingerParams =
    typeof bruker === 'undefined'
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
          navIdent: bruker.onPremisesSamAccountName,
        };

  const { data } = useGetKlagebehandlingerQuery(queryParams, {
    pollingInterval: 3 * 1000,
  });
  const { data: utgaatte } = useGetAntallKlagebehandlingerMedUtgaatteFristerQuery(queryParams, {
    pollingInterval: 300 * 1000,
  });

  const total = data?.antallTreffTotalt ?? 0;

  if (total < from) {
    const lastPage = Math.ceil(total / PAGE_SIZE);
    return <Redirect to={lastPage.toString()} />;
  }

  const fromNumber = from + 1;
  const toNumber = Math.min(total, from + PAGE_SIZE);

  return (
    <SCTableContainer>
      <StyledTable className="tabell tabell--stripet">
        <TableHeaderFilters filters={filters} onChange={setFilters} />
        <OppgaveRader oppgaver={data?.klagebehandlinger} columnCount={7} />
        <SCTableFooter>
          <tr>
            <td colSpan={7}>
              <SCFooter>
                <span>{`Viser ${fromNumber} til ${toNumber} av ${total} klagebehandlinger`}</span>
                <Pagination total={total} pageSize={PAGE_SIZE} currentPage={currentPage} />
              </SCFooter>
            </td>
          </tr>
        </SCTableFooter>
      </StyledTable>

      <SCTableStats>Antall oppgaver med utgåtte frister: {utgaatte?.antall ?? 0}</SCTableStats>
    </SCTableContainer>
  );
};

interface OppgaveRaderProps {
  oppgaver?: IKlagebehandling[];
  columnCount: number;
}

const OppgaveRader: React.FC<OppgaveRaderProps> = ({ oppgaver, columnCount }) => {
  if (typeof oppgaver === 'undefined') {
    return (
      <tbody>
        <tr>
          <td colSpan={columnCount}>
            <Loader text={'Laster oppgaver...'} />
          </td>
        </tr>
      </tbody>
    );
  }

  if (oppgaver.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columnCount}>Ingen oppgaver i liste</td>
        </tr>
      </tbody>
    );
  }
  return (
    <tbody>
      {oppgaver.map((k) => (
        <Row {...k} key={k.id} />
      ))}
    </tbody>
  );
};

const parsePage = (page: string): number => {
  try {
    const parsed = Number.parseInt(page, 10);
    if (Number.isNaN(parsed)) {
      return 1;
    }
    return parsed;
  } catch {
    return 1;
  }
};

interface LoaderProps {
  text: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => (
  <div>
    <NavFrontendSpinner />
    <span>{text}</span>
  </div>
);
