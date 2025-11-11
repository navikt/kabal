import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';

/** Checks if the current behandling has a saksbehandler assigned. */
export const useHasSaksbehandler = (): boolean => {
  const { data, isSuccess } = useOppgave();

  return isSuccess && data.saksbehandler !== null;
};
