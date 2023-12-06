import { ArrowRightLeftIcon, PlusIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import React from 'react';
import { formatIdNumber } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { HistoryEventTypes, IKlagerEvent, IPart } from '@app/types/oppgavebehandling/response';
import { Line, getActorName } from './common';
import { HistoryEvent } from './event';

export const getKlager = ({ actor, event, previous, timestamp }: IKlagerEvent, key: string) => {
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

const Set = ({ actor, part, timestamp }: SetProps) => {
  const tag = useTag();

  return (
    <HistoryEvent tag={tag} type={HistoryEventTypes.KLAGER} timestamp={timestamp} icon={PlusIcon}>
      <Line>
        {getActorName(actor)} satt {tag.toLowerCase()} til{' '}
        <b>
          {part.name} ({formatIdNumber(part.id)})
        </b>
        . Ingen tidligere {tag.toLowerCase()}.
      </Line>
    </HistoryEvent>
  );
};

interface RemoveProps {
  actor: string | null;
  previousPart: IPart;
  timestamp: string;
}

const Remove = ({ actor, previousPart, timestamp }: RemoveProps) => {
  const tag = useTag();

  return (
    <HistoryEvent tag={tag} type={HistoryEventTypes.KLAGER} timestamp={timestamp} icon={XMarkOctagonIcon}>
      <Line>
        {getActorName(actor)} fjernet {tag.toLowerCase()}. Tidligere {tag.toLowerCase()} var{' '}
        <b>
          {previousPart.name} ({formatIdNumber(previousPart.id)})
        </b>
        .
      </Line>
    </HistoryEvent>
  );
};

interface ChangeProps {
  actor: string | null;
  part: IPart;
  previousPart: IPart;

  timestamp: string;
}

const Change = ({ actor, part, previousPart, timestamp }: ChangeProps) => {
  const tag = useTag();

  return (
    <HistoryEvent tag={tag} type={HistoryEventTypes.KLAGER} timestamp={timestamp} icon={ArrowRightLeftIcon}>
      <Line>
        {getActorName(actor)} endret {tag.toLowerCase()} fra{' '}
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
};

const useTag = () => {
  const { data } = useOppgave();

  return data?.typeId !== SaksTypeEnum.KLAGE ? 'Ankende part' : 'Klager';
};
