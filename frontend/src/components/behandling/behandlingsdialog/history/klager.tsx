import { ArrowRightLeftIcon, PlusIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import React from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { INavEmployee } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { HistoryEventTypes, IKlagerEvent, IPart } from '@app/types/oppgavebehandling/response';
import { Line, employeeName, partName, toKey } from './common';
import { HistoryEvent } from './event';

export const getKlager = (e: IKlagerEvent) => {
  const key = toKey(e);
  const { actor, event, previous, timestamp } = e;

  if (previous.event.part === null && event.part !== null) {
    return <Set actor={actor} part={event.part} timestamp={timestamp} key={key} />;
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

const Set = ({ actor, part, timestamp }: SetProps) => {
  const tag = useTag();

  return (
    <HistoryEvent tag={tag} type={HistoryEventTypes.KLAGER} timestamp={timestamp} icon={PlusIcon}>
      <Line>
        {employeeName(actor)} satt {tag.toLowerCase()} til {partName(part)}. Ingen tidligere {tag.toLowerCase()}.
      </Line>
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
      <Line>
        {employeeName(actor)} fjernet {tag.toLowerCase()}. Tidligere {tag.toLowerCase()} var {partName(previousPart)}.
      </Line>
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
      <Line>
        {employeeName(actor)} endret {tag.toLowerCase()} fra {partName(previousPart)} til {partName(part)}.
      </Line>
    </HistoryEvent>
  );
};

const useTag = () => {
  const { data } = useOppgave();

  return data?.typeId !== SaksTypeEnum.KLAGE ? 'Ankende part' : 'Klager';
};
