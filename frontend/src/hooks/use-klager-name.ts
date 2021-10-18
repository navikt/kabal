import { getFullName } from '../domain/name';
import { useKlagebehandling } from './use-klagebehandling';

export const useKlagerName = (): string | null => {
  const [klagebehandling, isLoading] = useKlagebehandling();

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return null;
  }

  const {
    klager: { person, virksomhet },
  } = klagebehandling;

  if (klagebehandling.klager.person !== null) {
    return getFullName(person.navn);
  }

  if (virksomhet !== null) {
    return `${virksomhet.navn ?? ''} ${
      virksomhet.virksomhetsnummer === null ? '' : `(${virksomhet.virksomhetsnummer})`
    }`;
  }

  return null;
};
