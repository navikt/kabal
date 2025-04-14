import { getInitalHandling } from '@app/components/receivers/functions';
import { isNotNull } from '@app/functions/is-not-type-guards';
import type { IMottaker } from '@app/types/documents/documents';
import { Brevmottakertype } from '@app/types/kodeverk';
import { type IPart, PartStatusEnum } from '@app/types/oppgave-common';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { useMemo } from 'react';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export interface IBrevmottaker extends IMottaker {
  brevmottakertyper: Brevmottakertype[];
  reachable: boolean;
}

export const useSuggestedBrevmottakere = (
  mottakerList: IMottaker[],
  templateId?: TemplateIdEnum | undefined,
): [IBrevmottaker[], boolean] => {
  const { data, isLoading } = useOppgave();

  return useMemo(() => {
    if (!isLoading && data !== undefined) {
      const { klager, sakenGjelder, prosessfullmektig } = data;

      const brevmottakere = [
        partToBrevmottaker(klager, Brevmottakertype.KLAGER, templateId),
        partToBrevmottaker(sakenGjelder, Brevmottakertype.SAKEN_GJELDER, templateId),
        partToBrevmottaker(prosessfullmektig, Brevmottakertype.PROSESSFULLMEKTIG, templateId),
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

          return mottaker === undefined
            ? sm
            : { ...mottaker, brevmottakertyper: sm.brevmottakertyper, reachable: sm.reachable };
        });

      return [brevmottakere, false];
    }

    return [EMPTY_BREVMOTTAKER_LIST, true];
  }, [isLoading, data, templateId, mottakerList]);
};

const EMPTY_BREVMOTTAKER_LIST: IBrevmottaker[] = [];

const partToBrevmottaker = (
  part: IPart | null,
  brevmottakerType: Brevmottakertype,
  templateId: TemplateIdEnum | undefined,
): IBrevmottaker | null => {
  if (part === null) {
    return null;
  }

  const handling = getInitalHandling(part, templateId);
  const reachable = !part.statusList.some(
    (s) => s.status === PartStatusEnum.DEAD || s.status === PartStatusEnum.DELETED,
  );

  return { part, brevmottakertyper: [brevmottakerType], handling, overriddenAddress: null, reachable };
};
