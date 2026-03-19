import { CheckmarkIcon } from '@navikt/aksel-icons';
import { employeeName, toKey } from '@/components/behandling/behandlingsdialog/history/common';
import { HistoryEvent } from '@/components/behandling/behandlingsdialog/history/event';
import { HistoryEventTypes, type IFerdigstiltEvent } from '@/types/oppgavebehandling/response';

export const getFerdigstiltEvent = (props: IFerdigstiltEvent) => <Ferdigstilt key={toKey(props)} {...props} />;

const Ferdigstilt = ({ actor, timestamp, event }: IFerdigstiltEvent) =>
  event === null ? null : (
    <HistoryEvent tag="Ferdigstilt" type={HistoryEventTypes.FERDIGSTILT} timestamp={timestamp} icon={CheckmarkIcon}>
      <p>{employeeName(actor)} ferdigstilte behandlingen.</p>
    </HistoryEvent>
  );
