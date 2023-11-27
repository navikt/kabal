import { useMemo } from 'react';
import { useGetUserQuery } from '@app/redux-api/bruker';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsSaksbehandler = () => {
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();

  const { data: userData, isLoading: userIsLoading } = useGetUserQuery();

  return useMemo(() => {
    if (
      oppgavebehandlingIsLoading ||
      userIsLoading ||
      typeof oppgavebehandling === 'undefined' ||
      typeof userData === 'undefined'
    ) {
      return false;
    }

    return oppgavebehandling.tildeltSaksbehandlerident === userData.navIdent;
  }, [oppgavebehandling, oppgavebehandlingIsLoading, userData, userIsLoading]);
};
