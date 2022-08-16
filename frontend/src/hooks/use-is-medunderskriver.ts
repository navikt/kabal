import { useMemo } from 'react';
import { useUser } from '../simple-api-state/use-user';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsMedunderskriver = () => {
  const { data: userData, isLoading } = useUser();
  const { data: oppgave } = useOppgave();

  return useMemo(() => {
    if (typeof oppgave === 'undefined' || isLoading || typeof userData === 'undefined') {
      return false;
    }

    return oppgave.medunderskriver?.navIdent === userData.navIdent;
  }, [oppgave, userData, isLoading]);
};
