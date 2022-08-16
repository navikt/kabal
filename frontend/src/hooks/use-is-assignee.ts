import { useMemo } from 'react';
import { useUser } from '../simple-api-state/use-user';
import { MedunderskriverFlyt } from '../types/kodeverk';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsAssignee = () => {
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();
  const { data: userData, isLoading: userIsLoading } = useUser();

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
      return oppgavebehandling.medunderskriver?.navIdent === userData.navIdent;
    }

    // Else, the case is assigned to the saksbehandler.
    return oppgavebehandling.tildeltSaksbehandler?.navIdent === userData.navIdent;
  }, [oppgavebehandling, userData, userIsLoading, oppgavebehandlingIsLoading]);
};
