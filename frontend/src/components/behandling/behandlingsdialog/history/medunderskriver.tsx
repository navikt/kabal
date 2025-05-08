import { SELF, employeeName, toKey } from '@app/components/behandling/behandlingsdialog/history/common';
import { HistoryEvent } from '@app/components/behandling/behandlingsdialog/history/event';
import type { INavEmployee } from '@app/types/bruker';
import { FlowState } from '@app/types/oppgave-common';
import { HistoryEventTypes, type IMedunderskriverEvent } from '@app/types/oppgavebehandling/response';
import {
  ArrowRedoIcon,
  ArrowRightLeftIcon,
  ArrowUndoIcon,
  CheckmarkIcon,
  PaperplaneIcon,
  XMarkOctagonIcon,
} from '@navikt/aksel-icons';

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

      if (actor?.navIdent === event.medunderskriver.navIdent) {
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
  actor: INavEmployee | null;
  timestamp: string;
}

const Retracted = ({ actor, timestamp }: RetractedProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={ArrowRedoIcon}
  >
    <p>
      {employeeName(actor)} hentet saken tilbake fra saksbehandler til {SELF}.
    </p>
  </HistoryEvent>
);

interface SendBackProps {
  actor: INavEmployee | null;
  medunderskriver: INavEmployee | null;
  timestamp: string;
}

const SendBack = ({ actor, medunderskriver, timestamp }: SendBackProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={ArrowRedoIcon}
  >
    <p>
      {employeeName(actor)} sendte saken tilbake til medunderskriver {employeeName(medunderskriver)}.
    </p>
  </HistoryEvent>
);

interface SendProps {
  actor: INavEmployee | null;
  medunderskriver: INavEmployee | null;
  timestamp: string;
}

const Send = ({ actor, medunderskriver, timestamp }: SendProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={PaperplaneIcon}
  >
    <p>
      {employeeName(actor)} sendte saken til medunderskriver {employeeName(medunderskriver)}.
    </p>
  </HistoryEvent>
);

interface ReturnProps {
  actor: INavEmployee | null;
  timestamp: string;
}

const Return = ({ actor, timestamp }: ReturnProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={CheckmarkIcon}
  >
    <p>{employeeName(actor)} returnerte saken fra medunderskrift til saksbehandler.</p>
  </HistoryEvent>
);

interface RetractOther {
  actor: INavEmployee | null;
  medunderskriver: INavEmployee | null;
  timestamp: string;
}

const RetractOther = ({ actor, medunderskriver, timestamp }: RetractOther) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={ArrowUndoIcon}
  >
    <p>
      {employeeName(actor)} hentet saken tilbake fra medunderskriver {employeeName(medunderskriver)}.
    </p>
  </HistoryEvent>
);

interface RemoveProps {
  actor: INavEmployee | null;
  previousMedunderskriver: INavEmployee | null;
  timestamp: string;
}

const Remove = ({ actor, previousMedunderskriver, timestamp }: RemoveProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={XMarkOctagonIcon}
  >
    <p>
      {employeeName(actor)} fjernet {employeeName(previousMedunderskriver)} som medunderskriver.
    </p>
  </HistoryEvent>
);

interface SendOtherProps {
  actor: INavEmployee | null;
  medunderskriver: INavEmployee | null;
  timestamp: string;
}

const SendOther = ({ actor, medunderskriver, timestamp }: SendOtherProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={PaperplaneIcon}
  >
    <p>
      {employeeName(actor)} sendte saken til medunderskriver {employeeName(medunderskriver)}.
    </p>
  </HistoryEvent>
);

interface ChangeProps {
  actor: INavEmployee | null;
  medunderskriver: INavEmployee | null;
  previousMedunderskriver: INavEmployee | null;
  timestamp: string;
}

const Change = ({ actor, medunderskriver, previousMedunderskriver, timestamp }: ChangeProps) => (
  <HistoryEvent
    tag="Medunderskriver"
    type={HistoryEventTypes.MEDUNDERSKRIVER}
    timestamp={timestamp}
    icon={ArrowRightLeftIcon}
  >
    <p>
      {employeeName(actor)} byttet medunderskriver fra {employeeName(previousMedunderskriver)} til{' '}
      {employeeName(medunderskriver)}.
    </p>
  </HistoryEvent>
);
