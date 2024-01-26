import { XMarkIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import React, { useId } from 'react';
import { HistoryEventTypes, IFeilregistrertEvent } from '@app/types/oppgavebehandling/response';
import { Line, Reason, employeeName, toKey } from './common';
import { HistoryEvent } from './event';

export const getFeilregistrertEvent = (props: IFeilregistrertEvent) => <Feilregistrert {...props} key={toKey(props)} />;

const Feilregistrert = ({ actor, event, timestamp }: IFeilregistrertEvent) => {
  const id = useId();

  if (event === null) {
    return null;
  }

  return (
    <HistoryEvent tag="Feilregistrert" type={HistoryEventTypes.FEILREGISTRERT} timestamp={timestamp} icon={XMarkIcon}>
      <Line>{employeeName(actor)} feilregistrerte behandlingen.</Line>
      <Label size="small" htmlFor={id}>
        Årsak
      </Label>
      <Reason id={id}>{event.reason}</Reason>
    </HistoryEvent>
  );
};
