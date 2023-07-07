import { useMemo } from 'react';
import { useUser } from '@app/simple-api-state/use-user';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useCanEdit = () => {
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

    return (
      !oppgavebehandling.isAvsluttetAvSaksbehandler &&
      oppgavebehandling.tildeltSaksbehandlerident === userData.navIdent &&
      oppgavebehandling.feilregistrering === null
    );
  }, [oppgavebehandling, userData, userIsLoading, oppgavebehandlingIsLoading]);
};
