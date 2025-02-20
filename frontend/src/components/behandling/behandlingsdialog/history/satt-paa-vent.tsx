import { isoDateToPretty } from '@app/domain/date';
import type { INavEmployee } from '@app/types/bruker';
import {
  HistoryEventTypes,
  type ISattPaaVentEvent,
  type SattPaaVentEvent,
} from '@app/types/oppgavebehandling/response';
import { PauseIcon, PlayIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import { useId } from 'react';
import { Line, Reason, employeeName, toKey } from './common';
import { HistoryEvent } from './event';

export const getSattPaaVent = (e: ISattPaaVentEvent) => {
  const key = toKey(e);
  const { actor, event, timestamp } = e;

  return event === null ? (
    <Stop actor={actor} timestamp={timestamp} key={key} />
  ) : (
    <Start actor={actor} event={event} timestamp={timestamp} key={key} />
  );
};

interface StartProps {
  actor: INavEmployee | null;
  event: SattPaaVentEvent;
  timestamp: string;
}

const Start = ({ actor, event, timestamp }: StartProps) => {
  const id = useId();

  return (
    <HistoryEvent tag="Venteperiode" type={HistoryEventTypes.SATT_PAA_VENT} timestamp={timestamp} icon={PauseIcon}>
      <Line>
        {employeeName(actor)} satte behandlingen på vent til{' '}
        <time className="font-bold" dateTime={event.to}>
          {isoDateToPretty(event.to)}
        </time>
        .
      </Line>
      <Label size="small" htmlFor={id}>
        Årsak
      </Label>
      <Reason id={id}>{event.reason}</Reason>
    </HistoryEvent>
  );
};

interface StopProps {
  actor: INavEmployee | null;
  timestamp: string;
}

const Stop = ({ actor, timestamp }: StopProps) => (
  <HistoryEvent tag="Venteperiode" type={HistoryEventTypes.SATT_PAA_VENT} timestamp={timestamp} icon={PlayIcon}>
    <Line>{employeeName(actor)} avsluttet venteperioden for behandlingen.</Line>
  </HistoryEvent>
);
