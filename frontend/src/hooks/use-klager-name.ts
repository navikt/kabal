import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useKlagerName = (): string | null => {
  const { data: oppgavebehandling, isLoading } = useOppgave();

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return null;
  }

  return oppgavebehandling.klager.name;
};
