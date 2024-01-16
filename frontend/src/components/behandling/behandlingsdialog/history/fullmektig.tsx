import { ArrowRightLeftIcon, PlusIcon, XMarkIcon } from '@navikt/aksel-icons';
import React from 'react';
import { formatIdNumber } from '@app/functions/format-id';
import { HistoryEventTypes, IFullmektigEvent, IPart } from '@app/types/oppgavebehandling/response';
import { Line, getActorName, toKey } from './common';
import { HistoryEvent } from './event';

export const getFullmektig = (e: IFullmektigEvent) => {
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
  actor: string | null;
  part: IPart;
  timestamp: string;
}

const Set = ({ actor, part, timestamp }: SetProps) => (
  <HistoryEvent tag="Fullmektig" type={HistoryEventTypes.FULLMEKTIG} timestamp={timestamp} icon={PlusIcon}>
    <Line>
      {getActorName(actor)} satt fullmektig til{' '}
      <b>
        {part.name} ({formatIdNumber(part.id)})
      </b>
      . Ingen tidligere fullmektig.
    </Line>
  </HistoryEvent>
);

interface RemoveProps {
  actor: string | null;
  previousPart: IPart;
  timestamp: string;
}

const Remove = ({ actor, previousPart, timestamp }: RemoveProps) => (
  <HistoryEvent tag="Fullmektig" type={HistoryEventTypes.FULLMEKTIG} timestamp={timestamp} icon={XMarkIcon}>
    <Line>
      {getActorName(actor)} fjernet fullmektig. Tidligere fullmektig var{' '}
      <b>
        {previousPart.name} ({formatIdNumber(previousPart.id)})
      </b>
      .
    </Line>
  </HistoryEvent>
);

interface ChangeProps {
  actor: string | null;
  part: IPart;
  previousPart: IPart;
  timestamp: string;
}

const Change = ({ actor, part, previousPart, timestamp }: ChangeProps) => (
  <HistoryEvent tag="Fullmektig" type={HistoryEventTypes.FULLMEKTIG} timestamp={timestamp} icon={ArrowRightLeftIcon}>
    <Line>
      {getActorName(actor)} endret fullmektig fra{' '}
      <b>
        {previousPart.name} ({formatIdNumber(previousPart.id)})
      </b>{' '}
      til{' '}
      <b>
        {part.name} ({formatIdNumber(part.id)})
      </b>
      .
    </Line>
  </HistoryEvent>
);
