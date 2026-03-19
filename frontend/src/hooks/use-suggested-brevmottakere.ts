import { useMemo } from 'react';
import { getInitalHandling } from '@/components/receivers/functions';
import { isNotNull } from '@/functions/is-not-type-guards';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import type { IMottaker } from '@/types/documents/documents';
import { Brevmottakertype } from '@/types/kodeverk';
import { type IFullmektig, type IPart, PartStatusEnum } from '@/types/oppgave-common';
import type { TemplateIdEnum } from '@/types/smart-editor/template-enums';

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
  part: IPart | IFullmektig | null,
  brevmottakerType: Brevmottakertype,
  templateId: TemplateIdEnum | undefined,
): IBrevmottaker | null => {
  if (part === null) {
    return null;
  }

  const handling = getInitalHandling(part, templateId);
  const reachable =
    part.statusList === null ||
    !part.statusList.some((s) => s.status === PartStatusEnum.DEAD || s.status === PartStatusEnum.DELETED);

  return { part, brevmottakertyper: [brevmottakerType], handling, overriddenAddress: null, reachable };
};
