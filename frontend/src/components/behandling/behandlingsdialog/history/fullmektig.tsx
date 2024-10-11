import type { INavEmployee } from '@app/types/bruker';
import { HistoryEventTypes, type IFullmektigEvent, type IPart } from '@app/types/oppgavebehandling/response';
import { ArrowRightLeftIcon, PlusIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Line, employeeName, partName, toKey } from './common';
import { HistoryEvent } from './event';

export const getFullmektig = (e: IFullmektigEvent) => {
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

const SetPart = ({ actor, part, timestamp }: SetProps) => (
  <HistoryEvent tag="Fullmektig" type={HistoryEventTypes.FULLMEKTIG} timestamp={timestamp} icon={PlusIcon}>
    <Line>
      {employeeName(actor)} satt fullmektig til {partName(part)}. Ingen tidligere fullmektig.
    </Line>
  </HistoryEvent>
);

interface RemoveProps {
  actor: INavEmployee | null;
  previousPart: IPart;
  timestamp: string;
}

const Remove = ({ actor, previousPart, timestamp }: RemoveProps) => (
  <HistoryEvent tag="Fullmektig" type={HistoryEventTypes.FULLMEKTIG} timestamp={timestamp} icon={XMarkIcon}>
    <Line>
      {employeeName(actor)} fjernet fullmektig. Tidligere fullmektig var {partName(previousPart)}.
    </Line>
  </HistoryEvent>
);

interface ChangeProps {
  actor: INavEmployee | null;
  part: IPart;
  previousPart: IPart;
  timestamp: string;
}

const Change = ({ actor, part, previousPart, timestamp }: ChangeProps) => (
  <HistoryEvent tag="Fullmektig" type={HistoryEventTypes.FULLMEKTIG} timestamp={timestamp} icon={ArrowRightLeftIcon}>
    <Line>
      {employeeName(actor)} endret fullmektig fra {partName(previousPart)} til {partName(part)}.
    </Line>
  </HistoryEvent>
);
