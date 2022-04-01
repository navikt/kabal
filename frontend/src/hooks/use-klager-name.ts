import { getFullName } from '../domain/name';
import { IOppgavebehandlingBase, ISakspart } from '../types/oppgavebehandling';
import { useOppgave } from './oppgavebehandling/use-oppgave';

type Key = keyof Pick<IOppgavebehandlingBase, 'klager' | 'sakenGjelder'>;

export const useSakspartName = (key: Key): string | null => {
  const { data: oppgavebehandling, isLoading } = useOppgave();

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return null;
  }

  return getSakspartName(oppgavebehandling[key]);
};

export const getSakspartName = (sakspart: ISakspart) => {
  const { person, virksomhet } = sakspart;

  if (person !== null) {
    return getFullName(person.navn);
  }

  if (virksomhet !== null) {
    return `${virksomhet.navn ?? ''} ${
      virksomhet.virksomhetsnummer === null ? '' : `(${virksomhet.virksomhetsnummer})`
    }`;
  }

  return null;
};
