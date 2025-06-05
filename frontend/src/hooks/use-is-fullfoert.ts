import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsFullfoert = (): boolean => {
  const { data, isSuccess } = useOppgave();

  return isSuccess && data.isAvsluttetAvSaksbehandler;
};
