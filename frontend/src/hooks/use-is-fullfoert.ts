import { useMemo } from 'react';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsFullfoert = (): boolean => {
  const { data: oppgave } = useOppgave();

  return useMemo(() => {
    if (typeof oppgave === 'undefined') {
      return false;
    }

    return oppgave.isAvsluttetAvSaksbehandler;
  }, [oppgave]);
};
