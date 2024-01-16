import { CheckmarkIcon } from '@navikt/aksel-icons';
import React from 'react';
import { HistoryEventTypes, IFerdigstiltEvent } from '@app/types/oppgavebehandling/response';
import { Line, getActorName, toKey } from './common';
import { HistoryEvent } from './event';

export const getFerdigstiltEvent = (props: IFerdigstiltEvent) => <Ferdigstilt {...props} key={toKey(props)} />;

const Ferdigstilt = ({ actor, timestamp, event }: IFerdigstiltEvent) =>
  event === null ? null : (
    <HistoryEvent tag="Ferdigstilt" type={HistoryEventTypes.FERDIGSTILT} timestamp={timestamp} icon={CheckmarkIcon}>
      <Line>{getActorName(actor)} ferdigstilte behandlingen.</Line>
    </HistoryEvent>
  );
