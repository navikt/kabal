import { ArrowRightLeftIcon, PlusIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { employeeName, partName, toKey } from '@/components/behandling/behandlingsdialog/history/common';
import { HistoryEvent } from '@/components/behandling/behandlingsdialog/history/event';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import type { INavEmployee } from '@/types/bruker';
import { SaksTypeEnum } from '@/types/kodeverk';
import { HistoryEventTypes, type IKlagerEvent, type IPart } from '@/types/oppgavebehandling/response';

export const getKlager = (e: IKlagerEvent) => {
  const key = toKey(e);
  const { actor, event, previous, timestamp } = e;

  if (previous.event.part === null && event.part !== null) {
    return <SetPart actor={actor} part={event.part} timestamp={timestamp} key={key} />;
  }

  if (previous.event.part !== null && event.part === null) {
    return <Remove actor={actor} previousPart={previous.event.part} timestamp={timestamp} key={key} />;
  }

  if (previous.event.part !== null && event.part !== null) {
    return (
      <Change actor={actor} part={event.part} previousPart={previous.event.part} timestamp={timestamp} key={key} />
    );
  }

  return null;
};

interface SetProps {
  actor: INavEmployee | null;
  part: IPart;
  timestamp: string;
}

const SetPart = ({ actor, part, timestamp }: SetProps) => {
  const tag = useTag();

  return (
    <HistoryEvent tag={tag} type={HistoryEventTypes.KLAGER} timestamp={timestamp} icon={PlusIcon}>
      <p>
        {employeeName(actor)} satt {tag.toLowerCase()} til {partName(part)}. Ingen tidligere {tag.toLowerCase()}.
      </p>
    </HistoryEvent>
  );
};

interface RemoveProps {
  actor: INavEmployee | null;
  previousPart: IPart;
  timestamp: string;
}

const Remove = ({ actor, previousPart, timestamp }: RemoveProps) => {
  const tag = useTag();

  return (
    <HistoryEvent tag={tag} type={HistoryEventTypes.KLAGER} timestamp={timestamp} icon={XMarkOctagonIcon}>
      <p>
        {employeeName(actor)} fjernet {tag.toLowerCase()}. Tidligere {tag.toLowerCase()} var {partName(previousPart)}.
      </p>
    </HistoryEvent>
  );
};

interface ChangeProps {
  actor: INavEmployee | null;
  part: IPart;
  previousPart: IPart;

  timestamp: string;
}

const Change = ({ actor, part, previousPart, timestamp }: ChangeProps) => {
  const tag = useTag();

  return (
    <HistoryEvent tag={tag} type={HistoryEventTypes.KLAGER} timestamp={timestamp} icon={ArrowRightLeftIcon}>
      <p>
        {employeeName(actor)} endret {tag.toLowerCase()} fra {partName(previousPart)} til {partName(part)}.
      </p>
    </HistoryEvent>
  );
};

const useTag = () => {
  const { data } = useOppgave();

  return data?.typeId !== SaksTypeEnum.KLAGE ? 'Ankende part' : 'Klager';
};
