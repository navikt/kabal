import { Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import { useTemaFromId, useTypeFromId, useHjemmelFromId } from '../../hooks/useKodeverkIds';
import {
  IKlagebehandling,
  useGetKlagebehandlingerQuery,
  useTildelSaksbehandlerMutation,
} from '../../redux-api/oppgaver';
import { IBruker, IEnhet } from '../../redux-api/bruker';
import { EtikettMain, EtikettTema } from '../../styled-components/Etiketter';
import { TableHeaderFilters } from './filter-header';
import { Filters } from './types';
import { isoDateToPretty } from '../../domene/datofunksjoner';

interface Props {
  bruker: IBruker;
  valgtEnhet: IEnhet;
}

const PAGE_SIZE = 10;

export const OppgaveTable: React.FC<Props> = ({ bruker, valgtEnhet }) => {
  const [filters, setFilters] = useState<Filters>({
    types: [],
    tema: [],
    hjemler: [],
    sortDescending: false,
  });
  const [from] = useState<number>(0);
  const { data } = useGetKlagebehandlingerQuery({
    from,
    count: from + PAGE_SIZE,
    sorting: 'FRIST',
    order: filters.sortDescending ? 'SYNKENDE' : 'STIGENDE',
    assigned: false,
    tema: filters.tema,
    types: filters.types,
    hjemler: filters.hjemler,
    unitId: valgtEnhet.id,
  });

  return (
    <table className="tabell tabell--stripet">
      <TableHeaderFilters filters={filters} onChange={setFilters} />
      <tbody>
        {data?.klagebehandlinger.map((k) => (
          <Row klagebehandling={k} bruker={bruker} key={k.id} />
        ))}
      </tbody>
    </table>
  );
};

interface RowProps {
  bruker: IBruker;
  klagebehandling: IKlagebehandling;
}

const Row: React.FC<RowProps> = ({ klagebehandling, bruker }) => {
  const [tildelSaksbehandler, loader] = useTildelSaksbehandlerMutation();
  const { id, type, tema, hjemmel, frist, klagebehandlingVersjon } = klagebehandling;
  // const { data: bruker, isLoading: brukerIsLoading } = useGetBrukerQuery();
  // const isLoading = loader.isLoading || brukerIsLoading;
  // const disabled = isLoading || typeof bruker === 'undefined';

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
            tildelSaksbehandler({ oppgaveId: id, klagebehandlingVersjon, navIdent: bruker.id, enhetId: 'valgtEnhet' })
          }
          spinner={loader.isLoading}
          disabled={loader.isLoading}
        >
          {getTildelText(loader.isLoading)}
        </Knapp>
      </td>
    </tr>
  );
};

const getTildelText = (loading: boolean) => (loading ? 'Tildeler...' : 'Tildel meg');
