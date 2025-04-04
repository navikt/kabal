import { isoDateToPretty } from '@app/domain/date';
import type { IOppgave } from '@app/types/oppgaver';

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
  if (sattPaaVent === null) {
    return null;
  }

  return (
    <div className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap" title={sattPaaVent.reason}>
      {sattPaaVent.reason}
    </div>
  );
};

const EXPIRED_TEXT_CLASS = 'text-surface-danger';
