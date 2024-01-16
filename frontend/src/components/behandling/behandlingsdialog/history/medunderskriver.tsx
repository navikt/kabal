/* eslint-disable max-lines */
import {
  ArrowRedoIcon,
  ArrowRightLeftIcon,
  ArrowUndoIcon,
  CheckmarkIcon,
  PaperplaneIcon,
  XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import React from 'react';
import { Line, getActorName, getName, toKey } from '@app/components/behandling/behandlingsdialog/history/common';
import { HistoryEvent } from '@app/components/behandling/behandlingsdialog/history/event';
import { FlowState } from '@app/types/oppgave-common';
import { HistoryEventTypes, IMedunderskriverEvent } from '@app/types/oppgavebehandling/response';

export const getMedunderskriverEvent = (e: IMedunderskriverEvent) => {
  const key = toKey(e);
  const { event, actor, previous, timestamp } = e;
  const isFlowChange = event.flow !== previous.event.flow;

  if (isFlowChange) {
    if (previous.event.flow === FlowState.RETURNED && event.flow === FlowState.SENT) {
      if (event.medunderskriver === null) {
        console.warn('Cannot be sent to medunderskriver when medunderskriver is null.');

        return null;
      }

      if (actor === event.medunderskriver) {
        return <Retracted actor={actor} timestamp={timestamp} key={key} />;
      }

      return <SendBack actor={actor} medunderskriver={event.medunderskriver} timestamp={timestamp} key={key} />;
    }

    if (previous.event.flow === FlowState.NOT_SENT && event.flow === FlowState.SENT) {
      return <Send actor={actor} medunderskriver={event.medunderskriver} timestamp={timestamp} key={key} />;
    }

    if (previous.event.flow === FlowState.SENT && event.flow === FlowState.RETURNED) {
      return <Return actor={actor} timestamp={timestamp} key={key} />;
    }

    if (previous.event.flow === FlowState.SENT && event.flow === FlowState.NOT_SENT) {
      return <RetractOther actor={actor} medunderskriver={event.medunderskriver} timestamp={timestamp} key={key} />;
    }
  }

  const isMedunderskriverChange = event.medunderskriver !== previous.event.medunderskriver;

  if (isMedunderskriverChange && event.flow !== FlowState.NOT_SENT) {
    if (event.medunderskriver === null) {
      return (
        <Remove
          actor={actor}
          previousMedunderskriver={previous.event.medunderskriver}
          timestamp={timestamp}
          key={key}
        />
      );
    }

    if (previous.event.medunderskriver === null) {
      return <SendOther actor={actor} medunderskriver={event.medunderskriver} timestamp={timestamp} key={key} />;
    }

    return (
      <Change
        actor={actor}
        medunderskriver={event.medunderskriver}
        previousMedunderskriver={previous.event.medunderskriver}
        timestamp={timestamp}
        key={key}
      />
    );
  }

  return null;
};

interface RetractedProps {
  actor: string | null;
  timestamp: string;
}

const Retracted = ({ actor, timestamp }: RetractedProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={ArrowRedoIcon}
  >
    <Line>
      {getActorName(actor)} hentet saken tilbake fra saksbehandler til <b>seg selv</b>.
    </Line>
  </HistoryEvent>
);

interface SendBackProps {
  actor: string | null;
  medunderskriver: string | null;
  timestamp: string;
}

const SendBack = ({ actor, medunderskriver, timestamp }: SendBackProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={ArrowRedoIcon}
  >
    <Line>
      {getActorName(actor)} sendte saken tilbake til medunderskriver {getName(medunderskriver)}.
    </Line>
  </HistoryEvent>
);

interface SendProps {
  actor: string | null;
  medunderskriver: string | null;
  timestamp: string;
}

const Send = ({ actor, medunderskriver, timestamp }: SendProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={PaperplaneIcon}
  >
    <Line>
      {getActorName(actor)} sendte saken til medunderskriver {getName(medunderskriver)}.
    </Line>
  </HistoryEvent>
);

interface ReturnProps {
  actor: string | null;
  timestamp: string;
}

const Return = ({ actor, timestamp }: ReturnProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={CheckmarkIcon}
  >
    <Line>{getActorName(actor)} returnerte saken fra medunderskrift til saksbehandler.</Line>
  </HistoryEvent>
);

interface RetractOther {
  actor: string | null;
  medunderskriver: string | null;
  timestamp: string;
}

const RetractOther = ({ actor, medunderskriver, timestamp }: RetractOther) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={ArrowUndoIcon}
  >
    <Line>
      {getActorName(actor)} hentet saken tilbake fra medunderskriver {getName(medunderskriver)}.
    </Line>
  </HistoryEvent>
);

interface RemoveProps {
  actor: string | null;
  previousMedunderskriver: string | null;
  timestamp: string;
}

const Remove = ({ actor, previousMedunderskriver, timestamp }: RemoveProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={XMarkOctagonIcon}
  >
    <Line>
      {getActorName(actor)} fjernet {getName(previousMedunderskriver)} som medunderskriver.
    </Line>
  </HistoryEvent>
);

interface SendOtherProps {
  actor: string | null;
  medunderskriver: string | null;
  timestamp: string;
}

const SendOther = ({ actor, medunderskriver, timestamp }: SendOtherProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={PaperplaneIcon}
  >
    <Line>
      {getActorName(actor)} sendte saken til medunderskriver {getName(medunderskriver)}.
    </Line>
  </HistoryEvent>
);

interface ChangeProps {
  actor: string | null;
  medunderskriver: string | null;
  previousMedunderskriver: string | null;
  timestamp: string;
}

const Change = ({ actor, medunderskriver, previousMedunderskriver, timestamp }: ChangeProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={ArrowRightLeftIcon}
  >
    <Line>
      {getActorName(actor)} byttet medunderskriver fra {getName(previousMedunderskriver)} til {getName(medunderskriver)}
      .
    </Line>
  </HistoryEvent>
);
