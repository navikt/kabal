import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import 'nav-frontend-tabell-style';
import {
  LoadKlagebehandlingerParams,
  useGetAntallKlagebehandlingerMedUtgaatteFristerQuery,
  useGetKlagebehandlingerQuery,
} from '../../redux-api/oppgaver';
import { useGetBrukerQuery, useGetValgtEnhetQuery } from '../../redux-api/bruker';
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
  const { data: valgtEnhet } = useGetValgtEnhetQuery(bruker?.onPremisesSamAccountName ?? skipToken);

  const currentPage = parsePage(page);
  const from = (currentPage - 1) * PAGE_SIZE;

  const queryParams: typeof skipToken | LoadKlagebehandlingerParams =
    typeof valgtEnhet === 'undefined' || typeof bruker === 'undefined'
      ? skipToken
      : {
          from,
          count: PAGE_SIZE,
          sorting: 'FRIST',
          order: filters.sortDescending ? 'SYNKENDE' : 'STIGENDE',
          assigned: false,
          tema: filters.tema,
          types: filters.types,
          hjemler: filters.hjemler,
          unitId: valgtEnhet.id,
          navIdent: bruker.onPremisesSamAccountName,
        };

  const { data } = useGetKlagebehandlingerQuery(queryParams, {
    pollingInterval: 3 * 1000,
  });
  const { data: utgaatte } = useGetAntallKlagebehandlingerMedUtgaatteFristerQuery(queryParams, {
    pollingInterval: 300 * 1000,
  });

  if (typeof valgtEnhet === 'undefined') {
    return <Loader text={'Laster valgt enhet...'} />;
  }

  if (typeof data === 'undefined') {
    return <Loader text={`Laster side ${from} `} />;
  }

  if (data.antallTreffTotalt < from) {
    const lastPage = Math.ceil(data.antallTreffTotalt / PAGE_SIZE);
    return <Redirect to={lastPage.toString()} />;
  }

  const fromNumber = from + 1;
  const toNumber = Math.min(data.antallTreffTotalt, from + PAGE_SIZE);

  const OppgaveRader = () => {
    if (data.klagebehandlinger.length === 0) {
      return (
        <tr>
          <td colSpan={5}>Ingen oppgaver i liste</td>
        </tr>
      );
    }
    return (
      <tbody>
        {data.klagebehandlinger.map((k) => (
          <Row {...k} key={k.id} />
        ))}
      </tbody>
    );
  };

  return (
    <SCTableContainer>
      <StyledTable className="tabell tabell--stripet">
        <TableHeaderFilters filters={filters} onChange={setFilters} />
        <OppgaveRader />
        <SCTableFooter>
          <tr>
            <td colSpan={5}>
              <SCFooter>
                <span>{`Viser ${fromNumber} til ${toNumber} av ${data.antallTreffTotalt} klagebehandlinger`}</span>
                <Pagination total={data.antallTreffTotalt} pageSize={PAGE_SIZE} currentPage={currentPage} />
              </SCFooter>
            </td>
          </tr>
        </SCTableFooter>
      </StyledTable>

      <SCTableStats>Antall oppgaver med utgåtte frister: {utgaatte?.antall ?? 0}</SCTableStats>
    </SCTableContainer>
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
