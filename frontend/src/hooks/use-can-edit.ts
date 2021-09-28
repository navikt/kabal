import { useMemo } from 'react';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { useGetKlagebehandlingQuery } from '../redux-api/oppgave';

export const useCanEdit = (klagebehandlingId: string) => {
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);
  const { data: userData, isLoading } = useGetBrukerQuery();

  return useMemo(() => {
    if (typeof klagebehandling === 'undefined' || isLoading || typeof userData === 'undefined') {
      return false;
    }
    return (
      klagebehandling.tildeltSaksbehandlerident === userData.info.navIdent &&
      klagebehandling.avsluttetAvSaksbehandler === null
    );
  }, [klagebehandling, userData, isLoading]);
};
