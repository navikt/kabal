import { useMemo } from 'react';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsFullfoert = (): boolean => {
  const { data: oppgavebehandling } = useOppgave();

  return useMemo(() => {
    if (typeof oppgavebehandling === 'undefined') {
      return false;
    }

    return oppgavebehandling.isAvsluttetAvSaksbehandler;
  }, [oppgavebehandling]);
};
