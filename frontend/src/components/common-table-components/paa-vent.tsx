import { isoDateToPretty } from '@app/domain/date';
import { usePaaVentReasons } from '@app/simple-api-state/use-kodeverk';
import { PaaVentReasonEnum } from '@app/types/kodeverk';
import type { IOppgave } from '@app/types/oppgaver';
import { Loader } from '@navikt/ds-react';

type Props = Pick<IOppgave, 'sattPaaVent'>;

export const PaaVentTil = ({ sattPaaVent }: Props) => {
  if (sattPaaVent === null) {
    return null;
  }

  const { isExpired, from, to } = sattPaaVent;

  const prettyFrom = isoDateToPretty(from) ?? 'Ukjent dato';
  const prettyTo = isoDateToPretty(to) ?? 'Ukjent dato';
  const className = isExpired ? EXPIRED_TEXT_CLASS : undefined;

  return (
    <time className={className} dateTime={to} title={`Satt på vent fra ${prettyFrom}`}>
      {prettyTo}
    </time>
  );
};

export const PaaVentReason = ({ sattPaaVent }: Props) => {
  const { data = [], isLoading } = usePaaVentReasons();

  if (sattPaaVent === null) {
    return null;
  }

  if (isLoading) {
    return <Loader aria-label="Laster..." size="small" />;
  }

  const reason: string =
    sattPaaVent.reasonId === PaaVentReasonEnum.ANNET
      ? (sattPaaVent.reason ?? 'Annet - ingen forklaring')
      : (data.find((r) => r.id === sattPaaVent.reasonId)?.beskrivelse ?? 'Ukjent årsak');

  return (
    <div className="max-w-60 truncate" title={reason}>
      {reason}
    </div>
  );
};

const EXPIRED_TEXT_CLASS = 'text-surface-danger';
