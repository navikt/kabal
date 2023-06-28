import { useMemo } from 'react';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { Brevmottakertype } from '@app/types/kodeverk';
import { IPart } from '@app/types/oppgave-common';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export interface IBrevmottaker {
  id: string;
  navn: string;
  brevmottakertyper: Brevmottakertype[];
  statusList: IPart['statusList'];
}

export const useBrevmottakere = (): IBrevmottaker[] => {
  const { data, isLoading } = useOppgave();

  return useMemo<IBrevmottaker[]>(() => {
    if (!isLoading && typeof data !== 'undefined') {
      const { klager, sakenGjelder, prosessfullmektig } = data;

      return [
        partToBrevmottaker(klager, Brevmottakertype.KLAGER),
        partToBrevmottaker(sakenGjelder, Brevmottakertype.SAKEN_GJELDER),
        partToBrevmottaker(prosessfullmektig, Brevmottakertype.PROSESSFULLMEKTIG),
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

const partToBrevmottaker = (part: IPart | null, brevmottakerType: Brevmottakertype): IBrevmottaker | null => {
  if (part === null) {
    return null;
  }

  return {
    id: part.id,
    navn: part.name ?? 'MANGLER',
    brevmottakertyper: [brevmottakerType],
    statusList: part.statusList,
  };
};
