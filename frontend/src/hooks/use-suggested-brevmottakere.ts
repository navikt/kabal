import { useMemo } from 'react';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { IMottaker } from '@app/types/documents/documents';
import { HandlingEnum } from '@app/types/documents/recipients';
import { Brevmottakertype } from '@app/types/kodeverk';
import { IPart } from '@app/types/oppgave-common';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export interface IBrevmottaker extends IMottaker {
  brevmottakertyper: Brevmottakertype[];
}

export const useSuggestedBrevmottakere = (mottakerList: IMottaker[]): [IBrevmottaker[], boolean] => {
  const { data, isLoading } = useOppgave();

  return useMemo(() => {
    if (!isLoading && data !== undefined) {
      const { klager, sakenGjelder, prosessfullmektig } = data;

      const brevmottakere = [
        partToBrevmottaker(klager, Brevmottakertype.KLAGER),
        partToBrevmottaker(sakenGjelder, Brevmottakertype.SAKEN_GJELDER),
        partToBrevmottaker(prosessfullmektig, Brevmottakertype.PROSESSFULLMEKTIG),
      ]
        .filter(isNotNull)
        .reduce<IBrevmottaker[]>((acc, curr) => {
          const found = acc.find(({ part }) => part.id === curr.part.id);

          if (found === undefined) {
            acc.push(curr);

            return acc;
          }

          found.brevmottakertyper.push(...curr.brevmottakertyper);

          return acc;
        }, [])
        .map((sm) => {
          const mottaker = mottakerList.find((m) => m.part.id === sm.part.id);

          return mottaker === undefined ? sm : { ...mottaker, brevmottakertyper: sm.brevmottakertyper };
        });

      return [brevmottakere, false];
    }

    return [EMPTY_BREVMOTTAKER_LIST, true];
  }, [data, mottakerList, isLoading]);
};

const EMPTY_BREVMOTTAKER_LIST: IBrevmottaker[] = [];

const partToBrevmottaker = (part: IPart | null, brevmottakerType: Brevmottakertype): IBrevmottaker | null => {
  if (part === null) {
    return null;
  }

  return { part, brevmottakertyper: [brevmottakerType], handling: HandlingEnum.AUTO, overriddenAddress: null };
};
