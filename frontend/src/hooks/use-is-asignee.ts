import { useMemo } from 'react';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { MedunderskriverFlyt } from '../redux-api/oppgave-state-types';
import { useKlagebehandling } from './use-klagebehandling';

export const useIsAsignee = () => {
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

    // If case is sent to the medunderskriver, the medunderskriver is assigned.
    if (klagebehandling.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
      return klagebehandling.medunderskriver?.navIdent === userData.info.navIdent;
    }

    // Else, the case is assigned to the saksbehandler.
    return klagebehandling.tildeltSaksbehandler?.navIdent === userData.info.navIdent;
  }, [klagebehandling, userData, userIsLoading, klagebehandlingIsLoading]);
};
