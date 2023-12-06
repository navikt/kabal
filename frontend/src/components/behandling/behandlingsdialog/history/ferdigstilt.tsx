import { CheckmarkIcon } from '@navikt/aksel-icons';
import React from 'react';
import { HistoryEventTypes, IFerdigstiltEvent } from '@app/types/oppgavebehandling/response';
import { Line, getActorName } from './common';
import { HistoryEvent } from './event';

export const getFerdigstiltEvent = (props: IFerdigstiltEvent, key: string) => <Ferdigstilt {...props} key={key} />;

const Ferdigstilt = ({ actor, timestamp }: IFerdigstiltEvent) => (
  <HistoryEvent tag="Ferdigstilt" type={HistoryEventTypes.FERDIGSTILT} timestamp={timestamp} icon={CheckmarkIcon}>
    <Line>{getActorName(actor)} ferdigstilte behandlingen.</Line>
  </HistoryEvent>
);
