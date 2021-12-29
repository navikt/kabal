import { useMemo } from 'react';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { MedunderskriverFlyt } from '../redux-api/klagebehandling-state-types';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsAsignee = () => {
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();
  const { data: userData, isLoading: userIsLoading } = useGetBrukerQuery();

  return useMemo(() => {
    if (
      oppgavebehandlingIsLoading ||
      userIsLoading ||
      typeof oppgavebehandling === 'undefined' ||
      typeof userData === 'undefined'
    ) {
      return false;
    }

    // If case is sent to the medunderskriver, the medunderskriver is assigned.
    if (oppgavebehandling.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
      return oppgavebehandling.medunderskriver?.navIdent === userData.info.navIdent;
    }

    // Else, the case is assigned to the saksbehandler.
    return oppgavebehandling.tildeltSaksbehandler?.navIdent === userData.info.navIdent;
  }, [oppgavebehandling, userData, userIsLoading, oppgavebehandlingIsLoading]);
};
