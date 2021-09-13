import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
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

  const currentPageNumber = parsePage(page);
  const from = currentPageNumber === 0 ? 0 : (currentPageNumber - 1) * PAGE_SIZE;

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
    return <Loader text={'Laster klagebehandlinger...'} />;
  }

  return (
    <>
      <table className="tabell tabell--stripet">
        <TableHeaderFilters filters={filters} onChange={setFilters} />
        <tbody>
          {data.klagebehandlinger.map((k) => (
            <Row {...k} key={k.id} />
          ))}
        </tbody>
      </table>
      <Pagination total={data.antallTreffTotalt} pageSize={PAGE_SIZE} currentPage={currentPageNumber} />
    </>
  );
};

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
