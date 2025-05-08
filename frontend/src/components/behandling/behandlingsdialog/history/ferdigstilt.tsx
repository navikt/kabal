import { HistoryEventTypes, type IFerdigstiltEvent } from '@app/types/oppgavebehandling/response';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { employeeName, toKey } from './common';
import { HistoryEvent } from './event';

export const getFerdigstiltEvent = (props: IFerdigstiltEvent) => <Ferdigstilt key={toKey(props)} {...props} />;

const Ferdigstilt = ({ actor, timestamp, event }: IFerdigstiltEvent) =>
  event === null ? null : (
    <HistoryEvent tag="Ferdigstilt" type={HistoryEventTypes.FERDIGSTILT} timestamp={timestamp} icon={CheckmarkIcon}>
      <p>{employeeName(actor)} ferdigstilte behandlingen.</p>
    </HistoryEvent>
  );
