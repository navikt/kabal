import { useMemo } from 'react';
import { getFullName } from '@app/domain/name';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { Brevmottakertype } from '@app/types/kodeverk';
import { ISakspart } from '@app/types/oppgavebehandling/oppgavebehandling';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export interface IBrevmottaker {
  id: string;
  navn: string;
  brevmottakertyper: Brevmottakertype[];
}

export const useBrevmottakere = (): IBrevmottaker[] => {
  const { data, isLoading } = useOppgave();

  return useMemo<IBrevmottaker[]>(() => {
    if (!isLoading && typeof data !== 'undefined') {
      const { klager, sakenGjelder, prosessfullmektig } = data;

      return [
        sakspartToBrevmottaker(klager, Brevmottakertype.KLAGER),
        sakspartToBrevmottaker(sakenGjelder, Brevmottakertype.SAKEN_GJELDER),
        sakspartToBrevmottaker(prosessfullmektig, Brevmottakertype.PROSESSFULLMEKTIG),
      ]
        .filter(isNotNull)
        .reduce<IBrevmottaker[]>((acc, curr) => {
          const found = acc.find(({ id }) => id === curr.id);

          if (typeof found === 'undefined') {
            acc.push(curr);

            return acc;
          }

          found.brevmottakertyper.push(...curr.brevmottakertyper);

          return acc;
        }, []);
    }

    return [];
  }, [data, isLoading]);
};

const sakspartToBrevmottaker = (
  sakspart: ISakspart | null,
  brevmottakerType: Brevmottakertype
): IBrevmottaker | null => {
  if (sakspart === null) {
    return null;
  }

  const { person, virksomhet } = sakspart;

  if (person !== null) {
    return {
      id: person.foedselsnummer ?? 'MANGLER',
      navn: getFullName(person.navn),
      brevmottakertyper: [brevmottakerType],
    };
  }

  if (virksomhet !== null) {
    return {
      id: virksomhet.virksomhetsnummer ?? 'MANGLER',
      navn: virksomhet.navn ?? 'MANGLER',
      brevmottakertyper: [brevmottakerType],
    };
  }

  return null;
};
