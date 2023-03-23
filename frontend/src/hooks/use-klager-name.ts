import { getSakspartName } from '@app/domain/name';
import { IOppgavebehandlingBase } from '@app/types/oppgavebehandling/oppgavebehandling';
import { useOppgave } from './oppgavebehandling/use-oppgave';

type Key = keyof Pick<IOppgavebehandlingBase, 'klager' | 'sakenGjelder'>;

export const useSakspartName = (key: Key): string | null => {
  const { data: oppgavebehandling, isLoading } = useOppgave();

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return null;
  }

  return getSakspartName(oppgavebehandling[key]);
};
