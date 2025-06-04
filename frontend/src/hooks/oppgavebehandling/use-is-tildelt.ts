import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';

export const useIsTildelt = (): boolean => {
  const { data, isSuccess } = useOppgave();

  return isSuccess ? data.saksbehandler !== null : false;
};
