import { XMarkIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import { useId } from 'react';
import { employeeName, Reason, toKey } from '@/components/behandling/behandlingsdialog/history/common';
import { HistoryEvent } from '@/components/behandling/behandlingsdialog/history/event';
import { HistoryEventTypes, type IFeilregistrertEvent } from '@/types/oppgavebehandling/response';

export const getFeilregistrertEvent = (props: IFeilregistrertEvent) => <Feilregistrert key={toKey(props)} {...props} />;

const Feilregistrert = ({ actor, event, timestamp }: IFeilregistrertEvent) => {
  const id = useId();

  if (event === null) {
    return null;
  }

  return (
    <HistoryEvent tag="Feilregistrert" type={HistoryEventTypes.FEILREGISTRERT} timestamp={timestamp} icon={XMarkIcon}>
      <p>{employeeName(actor)} feilregistrerte behandlingen.</p>
      <Label size="small" htmlFor={id}>
        Årsak
      </Label>
      <Reason id={id}>{event.reason}</Reason>
    </HistoryEvent>
  );
};
