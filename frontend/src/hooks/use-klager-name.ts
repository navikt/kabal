import { getFullName } from '../domain/name';
import { ISakenGjelder } from '../types/oppgavebehandling';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useKlagerName = (): string | null => {
  const { data: oppgavebehandling, isLoading } = useOppgave();

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return null;
  }

  return getSakenGjelderName(oppgavebehandling.sakenGjelder);
};

export const getSakenGjelderName = (sakenGjelder: ISakenGjelder) => {
  const { person, virksomhet } = sakenGjelder;

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
