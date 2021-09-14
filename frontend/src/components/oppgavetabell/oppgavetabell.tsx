import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import styled from 'styled-components';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
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
import { Pagination } from './pagination';
import 'nav-frontend-tabell-style';

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

  const currentPage = parsePage(page);
  const from = (currentPage - 1) * PAGE_SIZE;

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

  const fromNumber = from + 1;
  const toNumber = Math.min(data.antallTreffTotalt, from + PAGE_SIZE);

  return (
    <SCTableContainer>
      <table className="tabell tabell--stripet">
        <TableHeaderFilters filters={filters} onChange={setFilters} />
        <tbody>
          {data.klagebehandlinger.map((k) => (
            <Row {...k} key={k.id} />
          ))}
        </tbody>
        <SCTableFooter>
          <tr>
            <td colSpan={5}>
              <FooterContainer>
                <span>{`Viser ${fromNumber} til ${toNumber} av ${data.antallTreffTotalt} klagebehandlinger`}</span>
                <Pagination total={data.antallTreffTotalt} pageSize={PAGE_SIZE} currentPage={currentPage} />
              </FooterContainer>
            </td>
          </tr>
        </SCTableFooter>
      </table>

      <SCTableStats>Antall oppgaver med utgåtte frister: TODO</SCTableStats>
    </SCTableContainer>
  );
};

const SCTableContainer = styled.div`
  margin: 20px;
  border: 1px solid #c7c7c7;
  max-width: 1200px;
  overflow: auto;
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const SCTableFooter = styled.tfoot`
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

const SCTableStats = styled.div`
  padding: 10px;
`;

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
