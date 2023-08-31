import { useMemo } from 'react';
import { useUser } from '@app/simple-api-state/use-user';
import { FlowState } from '@app/types/oppgave-common';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsRol = () => {
  const { data: oppgave, isLoading } = useOppgave();

  const { data: userData, isLoading: userIsLoading } = useUser();

  return useMemo(() => {
    if (isLoading || userIsLoading || typeof oppgave === 'undefined' || typeof userData === 'undefined') {
      return false;
    }

    return oppgave.rol.flowState !== FlowState.NOT_SENT && oppgave.rol.navIdent === userData.navIdent;
  }, [oppgave, userData, userIsLoading, isLoading]);
};
