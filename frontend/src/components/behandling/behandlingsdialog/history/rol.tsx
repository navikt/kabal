import { Line, SELF, employeeName, toKey } from '@app/components/behandling/behandlingsdialog/history/common';
import { HistoryEvent } from '@app/components/behandling/behandlingsdialog/history/event';
import type { INavEmployee } from '@app/types/bruker';
import { FlowState } from '@app/types/oppgave-common';
import { HistoryEventTypes, type IRolEvent } from '@app/types/oppgavebehandling/response';
import {
  ArrowRedoIcon,
  ArrowRightLeftIcon,
  ArrowUndoIcon,
  CheckmarkIcon,
  PaperplaneIcon,
  PlusIcon,
} from '@navikt/aksel-icons';

export const getROLEvent = (e: IRolEvent) => {
  const key = toKey(e);
  const { actor, event, previous, timestamp } = e;
  const isFlowChange = event.flow !== previous.event.flow;

  if (isFlowChange) {
    // ROL henter saken tilbake fra saksbehandler.
    if (previous.event.flow === FlowState.RETURNED && event.flow === FlowState.SENT) {
      if (actor === event.rol) {
        return <Reclaim actor={actor} timestamp={timestamp} key={key} />;
      }

      return <Resend actor={actor} rol={event.rol} timestamp={timestamp} key={key} />;
    }

    if (event.flow === FlowState.SENT) {
      const from = previous.event.flow !== FlowState.NOT_SENT ? <> fra {employeeName(previous.event.rol)}</> : <></>;

      if (actor === event.rol) {
        return <ClaimSelf actor={actor} from={from} timestamp={timestamp} key={key} />;
      }

      return <SendToOther actor={actor} from={from} rol={event.rol} timestamp={timestamp} key={key} />;
    }

    if (event.flow === FlowState.RETURNED) {
      return <Return actor={actor} timestamp={timestamp} key={key} />;
    }

    if (previous.event.flow === FlowState.SENT && event.flow === FlowState.NOT_SENT) {
      return <Retract actor={actor} rol={event.rol} timestamp={timestamp} key={key} />;
    }
  }

  const isRolChange = event.rol !== previous.event.rol;

  if (isRolChange && event.flow !== FlowState.NOT_SENT) {
    return <Change actor={actor} previousRol={previous.event.rol} rol={event.rol} timestamp={timestamp} key={key} />;
  }

  return null;
};

interface Reclaim {
  actor: INavEmployee | null;
  timestamp: string;
}

const Reclaim = ({ actor, timestamp }: Reclaim) => (
  <HistoryEvent tag="Rådgivende overlege" type={HistoryEventTypes.ROL} timestamp={timestamp} icon={ArrowRedoIcon}>
    <Line>
      {employeeName(actor)} hentet saken tilbake fra saksbehandler til {SELF}.
    </Line>
  </HistoryEvent>
);

interface Resend {
  actor: INavEmployee | null;
  rol: INavEmployee | null;
  timestamp: string;
}

const Resend = ({ actor, rol, timestamp }: Resend) => (
  <HistoryEvent tag="Rådgivende overlege" type={HistoryEventTypes.ROL} timestamp={timestamp} icon={ArrowRedoIcon}>
    <Line>
      {employeeName(actor)} sendte saken tilbake til {employeeName(rol)}.
    </Line>
  </HistoryEvent>
);

interface ClaimSelfProps {
  actor: INavEmployee | null;
  from: React.ReactNode;
  timestamp: string;
}

const ClaimSelf = ({ actor, from, timestamp }: ClaimSelfProps) => (
  <HistoryEvent tag="Rådgivende overlege" type={HistoryEventTypes.ROL} timestamp={timestamp} icon={PlusIcon}>
    <Line>
      {employeeName(actor)} satte saken{from} til {SELF}.
    </Line>
  </HistoryEvent>
);

interface SendToOtherProps {
  actor: INavEmployee | null;
  rol: INavEmployee | null;
  from: React.ReactNode;
  timestamp: string;
}

const SendToOther = ({ actor, rol, from, timestamp }: SendToOtherProps) => (
  <HistoryEvent tag="Rådgivende overlege" type={HistoryEventTypes.ROL} timestamp={timestamp} icon={PaperplaneIcon}>
    <Line>
      {employeeName(actor)} sendte saken{from} til {employeeName(rol)}.
    </Line>
  </HistoryEvent>
);

interface ReturnProps {
  actor: INavEmployee | null;
  timestamp: string;
}

const Return = ({ actor, timestamp }: ReturnProps) => (
  <HistoryEvent tag="Rådgivende overlege" type={HistoryEventTypes.ROL} timestamp={timestamp} icon={CheckmarkIcon}>
    <Line>
      {employeeName(actor)} returnerte saken <b>til saksbehandler</b>.
    </Line>
  </HistoryEvent>
);

interface RetractProps {
  actor: INavEmployee | null;
  rol: INavEmployee | null;
  timestamp: string;
}

const Retract = ({ actor, rol, timestamp }: RetractProps) => (
  <HistoryEvent tag="Rådgivende overlege" type={HistoryEventTypes.ROL} timestamp={timestamp} icon={ArrowUndoIcon}>
    <Line>
      {employeeName(actor)} hentet saken tilbake fra {employeeName(rol)}.
    </Line>
  </HistoryEvent>
);

interface ChangeProps {
  actor: INavEmployee | null;
  previousRol: INavEmployee | null;
  rol: INavEmployee | null;
  timestamp: string;
}

const Change = ({ actor, previousRol, rol, timestamp }: ChangeProps) => (
  <HistoryEvent tag="Rådgivende overlege" type={HistoryEventTypes.ROL} timestamp={timestamp} icon={ArrowRightLeftIcon}>
    <Line>
      {employeeName(actor)} flyttet saken fra {employeeName(previousRol)} til {employeeName(rol)}.
    </Line>
  </HistoryEvent>
);
