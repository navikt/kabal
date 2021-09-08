import { Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import { useTemaFromId, useTypeFromId, useHjemmelFromId } from '../../hooks/useKodeverkIds';
import {
  IKlagebehandling,
  useGetKlagebehandlingerQuery,
  useTildelSaksbehandlerMutation,
} from '../../redux-api/oppgaver';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { EtikettMain, EtikettTema } from '../../styled-components/Etiketter';
import { TableHeaderFilters } from './filter-header';
import { Filters } from './types';
import { isoDateToPretty } from '../../domene/datofunksjoner';

const PAGE_SIZE = 10;

export const OppgaveTable: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    types: [],
    tema: [],
    hjemler: [],
    sortDescending: false,
  });
  const [from] = useState<number>(0);
  // const { data: valgtEnhet, isLoading: enhetIsLoading } = useGetValgtEnhetQuery(bruker?.id);
  const { data } = useGetKlagebehandlingerQuery({
    from,
    count: from + PAGE_SIZE,
    sorting: 'FRIST',
    order: filters.sortDescending ? 'SYNKENDE' : 'STIGENDE',
    assigned: false,
    tema: filters.tema,
    types: filters.types,
    hjemler: filters.hjemler,
    unitId: 'valgtEnhet',
  });

  return (
    <table className="tabell tabell--stripet">
      <TableHeaderFilters filters={filters} onChange={setFilters} />
      <tbody>
        {data?.klagebehandlinger.map((k) => (
          <Row {...k} key={k.id} />
        ))}
      </tbody>
    </table>
  );
};

const Row: React.FC<IKlagebehandling> = ({ id, type, tema, hjemmel, frist, klagebehandlingVersjon }) => {
  const [tildelSaksbehandler, loader] = useTildelSaksbehandlerMutation();
  const { data: bruker, isLoading: brukerIsLoading } = useGetBrukerQuery();
  const isLoading = loader.isLoading || brukerIsLoading;
  const disabled = isLoading || typeof bruker === 'undefined';

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
        <Knapp
          onClick={() =>
            tildelSaksbehandler({ oppgaveId: id, klagebehandlingVersjon, navIdent: bruker?.id, enhetId: 'valgtEnhet' })
          }
          spinner={isLoading}
          disabled={disabled}
        >
          {getTildelText(loader.isLoading)}
        </Knapp>
      </td>
    </tr>
  );
};

const getTildelText = (loading: boolean) => (loading ? 'Tildeler...' : 'Tildel meg');
