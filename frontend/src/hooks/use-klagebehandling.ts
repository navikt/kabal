import { useGetKlagebehandlingQuery } from '../redux-api/oppgave';
import { IKlagebehandling } from '../redux-api/oppgave-state-types';
import { useKlagebehandlingId } from './use-klagebehandling-id';

export const useKlagebehandling = (): [IKlagebehandling | undefined, boolean] => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data, isLoading } = useGetKlagebehandlingQuery(klagebehandlingId);

  return [data, isLoading];
};
