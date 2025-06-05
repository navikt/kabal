import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsFeilregistrert = (): boolean => {
  const { data, isSuccess } = useOppgave();

  return isSuccess && data.feilregistrering !== null;
};
