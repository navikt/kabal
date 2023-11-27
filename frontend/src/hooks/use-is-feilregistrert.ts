import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsFeilregistrert = (): boolean => {
  const { data: oppgave } = useOppgave();

  if (typeof oppgave === 'undefined') {
    return false;
  }

  return oppgave.feilregistrering !== null;
};
