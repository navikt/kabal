import { PauseIcon, PlayIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import { useId } from 'react';
import { styled } from 'styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { INavEmployee } from '@app/types/bruker';
import { HistoryEventTypes, ISattPaaVentEvent, SattPaaVentEvent } from '@app/types/oppgavebehandling/response';
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
        <StyledTime dateTime={event.to}>{isoDateToPretty(event.to)}</StyledTime>.
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

const StyledTime = styled.time`
  font-weight: bold;
`;
