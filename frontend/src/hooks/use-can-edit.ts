import { useMemo } from 'react';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { useGetKlagebehandlingQuery } from '../redux-api/oppgave';
import { useIsFullfoert } from './use-is-fullfoert';

export const useCanEdit = (klagebehandlingId: string) => {
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);
  const { data: userData, isLoading } = useGetBrukerQuery();
  const isFullfoert = useIsFullfoert(klagebehandlingId);

  return useMemo(() => {
    if (typeof klagebehandling === 'undefined' || isLoading || typeof userData === 'undefined') {
      return false;
    }

    return klagebehandling.tildeltSaksbehandler?.navIdent === userData.info.navIdent && !isFullfoert;
  }, [klagebehandling, userData, isLoading, isFullfoert]);
};
