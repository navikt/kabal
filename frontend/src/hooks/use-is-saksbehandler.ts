import { useMemo } from 'react';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { useKlagebehandling } from './use-klagebehandling';

export const useIsSaksbehandler = () => {
  const [klagebehandling, klagebehandlingIsLoading] = useKlagebehandling();
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

    return klagebehandling.tildeltSaksbehandler?.navIdent === userData.info.navIdent;
  }, [klagebehandling, userData, userIsLoading, klagebehandlingIsLoading]);
};
