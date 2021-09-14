import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import styled from 'styled-components';
import { useTemaFromId, useTypeFromId, useHjemmelFromId } from '../../hooks/useKodeverkIds';
import {
  IKlagebehandling,
  useGetKlagebehandlingerQuery,
  useTildelSaksbehandlerMutation,
} from '../../redux-api/oppgaver';
import { useGetBrukerQuery, useGetValgtEnhetQuery } from '../../redux-api/bruker';
import { EtikettMain, EtikettTema } from '../../styled-components/Etiketter';
import { TableHeaderFilters } from './filter-header';
import { Filters } from './types';
import { isoDateToPretty } from '../../domene/datofunksjoner';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { Pagination } from './pagination';

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
  const { data: valgtEnhet } = useGetValgtEnhetQuery(bruker?.id ?? skipToken);

  const noArgs: boolean = typeof page === 'undefined' ? true : false;
  const currentPageNumber = noArgs ? 1 : parsePage(page);
  const from = noArgs ? 0 : (parsePage(page) - 1) * PAGE_SIZE;

  const { data } = useGetKlagebehandlingerQuery(
    typeof valgtEnhet === 'undefined'
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
        }
  );

  if (typeof valgtEnhet === 'undefined') {
    return <Loader text={'Laster valgt enhet...'} />;
  }

  if (typeof data === 'undefined') {
    return <Loader text={`Laster side ${from} `} />;
  }

  const Table = styled.table`
    padding: 20px;
    border: none;
    -webkit-border-horizontal-spacing: 0px;
    -webkit-border-vertical-spacing: 0px;
    tr:nth-child(odd) {
      background-color: #ccc;
    }

    th {
      background-color: white;
      text-align: left;
    }
  `;
  return (
    <>
      <Table>
        <TableHeaderFilters filters={filters} onChange={setFilters} />
        <tbody>
          {data.klagebehandlinger.map((k) => (
            <Row {...k} key={k.id} />
          ))}
        </tbody>
      </Table>

      <CSTableFooter>
        <SCLeftSpan>{`Viser ${currentPageNumber * 10 - 9} til ${currentPageNumber * 10} av ${
          data.antallTreffTotalt
        } klagebehandlinger`}</SCLeftSpan>
        <SCRightSpan>
          <Pagination total={data.antallTreffTotalt} pageSize={PAGE_SIZE} currentPage={currentPageNumber} />
        </SCRightSpan>
      </CSTableFooter>

      <CSTableStats>Antall oppgaver med utgåtte frister: TODO</CSTableStats>
    </>
  );
};

const CSTableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  height: 30px;
  padding: 10px;

  background-color: rgba(0, 0, 0, 0.03);
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: rgba(0, 0, 0, 0.15);
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.15);
`;

const SCRightSpan = styled.div`
  flex-grow: 1;
  text-align: right;
`;

const SCLeftSpan = styled.div`
  flex-grow: 1;
`;

const CSTableStats = styled.div`
  padding: 10px;
`;

const parsePage = (page: string): number => {
  try {
    return Number.parseInt(page, 10);
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

const Row: React.FC<IKlagebehandling> = ({ id, type, tema, hjemmel, frist, klagebehandlingVersjon }) => {
  const [tildelSaksbehandler, loader] = useTildelSaksbehandlerMutation();
  const { data: bruker, isLoading: isUserLoading } = useGetBrukerQuery();
  const { data: valgtEnhet } = useGetValgtEnhetQuery(bruker?.id ?? skipToken);

  const onTildel = useCallback(() => {
    if (typeof bruker?.id === 'undefined') {
      return;
    }
    tildelSaksbehandler({ oppgaveId: id, klagebehandlingVersjon, navIdent: bruker.id, enhetId: valgtEnhet?.id });
  }, [id, klagebehandlingVersjon, bruker?.id, valgtEnhet?.id, tildelSaksbehandler]);

  const isLoading = loader.isLoading || isUserLoading;

  return (
    <tr>
      <td>
        <EtikettMain>{useTypeFromId(type)}</EtikettMain>
      </td>
      <td>
        <EtikettTema tema={tema}>{useTemaFromId(tema)}</EtikettTema>
      </td>
      <td>
        <EtikettMain>{useHjemmelFromId(hjemmel)}</EtikettMain>
      </td>
      <td>{isoDateToPretty(frist)}</td>
      <td>
        <Knapp onClick={onTildel} spinner={isLoading} disabled={isLoading}>
          {getTildelText(loader.isLoading)}
        </Knapp>
      </td>
    </tr>
  );
};

const getTildelText = (loading: boolean) => (loading ? 'Tildeler...' : 'Tildel meg');
