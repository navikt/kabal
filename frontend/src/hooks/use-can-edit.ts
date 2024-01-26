import { useContext, useMemo } from 'react';
import { UserContext } from '@app/components/app/user';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useCanEdit = () => {
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();
  const user = useContext(UserContext);

  return useMemo(() => {
    if (oppgavebehandlingIsLoading || typeof oppgavebehandling === 'undefined') {
      return false;
    }

    return (
      !oppgavebehandling.isAvsluttetAvSaksbehandler &&
      oppgavebehandling.saksbehandler !== null &&
      oppgavebehandling.saksbehandler.navIdent === user.navIdent &&
      oppgavebehandling.feilregistrering === null
    );
  }, [oppgavebehandling, oppgavebehandlingIsLoading, user.navIdent]);
};
