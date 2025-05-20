import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useMemo } from 'react';

export const useIsTildelt = () => {
  const { data: oppgavebehandling, isSuccess } = useOppgave();

  return useMemo(() => (isSuccess ? oppgavebehandling.saksbehandler !== null : false), [oppgavebehandling, isSuccess]);
};
