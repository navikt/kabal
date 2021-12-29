import { useMemo } from 'react';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsSaksbehandler = () => {
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

    return oppgavebehandling.tildeltSaksbehandler?.navIdent === userData.info.navIdent;
  }, [oppgavebehandling, userData, userIsLoading, oppgavebehandlingIsLoading]);
};
