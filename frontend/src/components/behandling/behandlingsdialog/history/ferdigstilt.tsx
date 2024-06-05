import { CheckmarkIcon } from '@navikt/aksel-icons';
import { HistoryEventTypes, IFerdigstiltEvent } from '@app/types/oppgavebehandling/response';
import { Line, employeeName, toKey } from './common';
import { HistoryEvent } from './event';

export const getFerdigstiltEvent = (props: IFerdigstiltEvent) => <Ferdigstilt {...props} key={toKey(props)} />;

const Ferdigstilt = ({ actor, timestamp, event }: IFerdigstiltEvent) =>
  event === null ? null : (
    <HistoryEvent tag="Ferdigstilt" type={HistoryEventTypes.FERDIGSTILT} timestamp={timestamp} icon={CheckmarkIcon}>
      <Line>{employeeName(actor)} ferdigstilte behandlingen.</Line>
    </HistoryEvent>
  );
