import { isoDateToPretty } from '@app/domain/date';
import { usePaaVentReasons } from '@app/simple-api-state/use-kodeverk';
import type { INavEmployee } from '@app/types/bruker';
import { PaaVentReasonEnum } from '@app/types/kodeverk';
import type { ISattPåVent } from '@app/types/oppgave-common';
import { HistoryEventTypes, type ISattPaaVentEvent } from '@app/types/oppgavebehandling/response';
import { PauseIcon, PlayIcon } from '@navikt/aksel-icons';
import { Label, Loader } from '@navikt/ds-react';
import { useId } from 'react';
import { employeeName, Reason, toKey } from './common';
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
  event: ISattPåVent;
  timestamp: string;
}

const Start = ({ actor, event, timestamp }: StartProps) => {
  const id = useId();
  const { data = [], isLoading } = usePaaVentReasons();

  const reason: string =
    event.reasonId === PaaVentReasonEnum.ANNET
      ? (event.reason ?? 'Annet - ingen forklaring')
      : (data.find((r) => r.id === event.reasonId)?.beskrivelse ?? 'Ukjent årsak');

  return (
    <HistoryEvent tag="Venteperiode" type={HistoryEventTypes.SATT_PAA_VENT} timestamp={timestamp} icon={PauseIcon}>
      <p>
        {employeeName(actor)} satte behandlingen på vent til{' '}
        <time className="font-bold" dateTime={event.to}>
          {isoDateToPretty(event.to)}
        </time>
        .
      </p>
      <Label size="small" htmlFor={id}>
        Årsak
      </Label>
      {isLoading ? <Loader aria-label="Laster..." /> : <Reason id={id}>{reason}</Reason>}
    </HistoryEvent>
  );
};

interface StopProps {
  actor: INavEmployee | null;
  timestamp: string;
}

const Stop = ({ actor, timestamp }: StopProps) => (
  <HistoryEvent tag="Venteperiode" type={HistoryEventTypes.SATT_PAA_VENT} timestamp={timestamp} icon={PlayIcon}>
    <p>{employeeName(actor)} avsluttet venteperioden for behandlingen.</p>
  </HistoryEvent>
);
