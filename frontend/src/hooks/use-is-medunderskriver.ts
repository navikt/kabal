import { useMemo } from 'react';
import { useUser } from '@app/simple-api-state/use-user';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsMedunderskriver = () => {
  const { data: userData, isLoading } = useUser();
  const { data: oppgave } = useOppgave();

  return useMemo(() => {
    if (typeof oppgave === 'undefined' || isLoading || typeof userData === 'undefined') {
      return false;
    }

    return oppgave.medunderskriverident === userData.navIdent;
  }, [oppgave, userData, isLoading]);
};
