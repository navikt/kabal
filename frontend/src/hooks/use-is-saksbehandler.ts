import { useContext, useMemo } from 'react';
import { UserContext } from '@app/components/app/user';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsSaksbehandler = () => {
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();

  const user = useContext(UserContext);

  return useMemo(() => {
    if (oppgavebehandlingIsLoading || oppgavebehandling === undefined) {
      return false;
    }

    return oppgavebehandling.tildeltSaksbehandlerident === user.navIdent;
  }, [oppgavebehandling, oppgavebehandlingIsLoading, user]);
};
