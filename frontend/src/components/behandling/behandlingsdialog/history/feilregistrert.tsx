import { XMarkIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import React, { useId } from 'react';
import { HistoryEventTypes, IFeilregistrertEvent } from '@app/types/oppgavebehandling/response';
import { Line, Reason, getActorName } from './common';
import { HistoryEvent } from './event';

export const getFeilregistrertEvent = (props: IFeilregistrertEvent, key: string) => (
  <Feilregistrert {...props} key={key} />
);

const Feilregistrert = ({ actor, event, timestamp }: IFeilregistrertEvent) => {
  const id = useId();

  return (
    <HistoryEvent tag="Feilregistrert" type={HistoryEventTypes.FEILREGISTRERT} timestamp={timestamp} icon={XMarkIcon}>
      <Line>{getActorName(actor)} feilregistrerte behandlingen.</Line>
      <Label size="small" htmlFor={id}>
        Årsak
      </Label>
      <Reason id={id}>{event.reason}</Reason>
    </HistoryEvent>
  );
};
