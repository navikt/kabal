import { useMemo } from 'react';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { useGetKlagebehandlingQuery } from '../redux-api/oppgave';

export const useCanEdit = (klagebehandlingId: string) => {
  const { data: klagebehandling, isLoading: klagebehandlingIsLoading } = useGetKlagebehandlingQuery(klagebehandlingId);
  const { data: userData, isLoading: userIsLoading } = useGetBrukerQuery();

  return useMemo(() => {
    if (
      klagebehandlingIsLoading ||
      userIsLoading ||
      typeof klagebehandling === 'undefined' ||
      typeof userData === 'undefined'
    ) {
      return false;
    }

    return (
      !klagebehandling.isAvsluttetAvSaksbehandler &&
      klagebehandling.tildeltSaksbehandler?.navIdent === userData.info.navIdent
    );
  }, [klagebehandling, userData, userIsLoading, klagebehandlingIsLoading]);
};
