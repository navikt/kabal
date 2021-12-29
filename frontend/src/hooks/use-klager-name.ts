import { getFullName } from '../domain/name';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useKlagerName = (): string | null => {
  const { data: oppgavebehandling, isLoading } = useOppgave();

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return null;
  }

  const {
    klager: { person, virksomhet },
  } = oppgavebehandling;

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
