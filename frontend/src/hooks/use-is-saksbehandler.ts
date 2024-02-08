import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsSaksbehandler = () => {
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();

  const { user } = useContext(StaticDataContext);

  return useMemo(() => {
    if (oppgavebehandlingIsLoading || oppgavebehandling === undefined) {
      return false;
    }

    return oppgavebehandling.saksbehandler?.navIdent === user.navIdent;
  }, [oppgavebehandling, oppgavebehandlingIsLoading, user]);
};
