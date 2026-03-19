import { Loader, Tooltip } from '@navikt/ds-react';
import { isoDateToPretty } from '@/domain/date';
import { useIsTruncated } from '@/hooks/use-is-truncated';
import { usePaaVentReasons } from '@/simple-api-state/use-kodeverk';
import { PaaVentReasonEnum } from '@/types/kodeverk';
import type { IOppgave } from '@/types/oppgaver';

type Props = Pick<IOppgave, 'sattPaaVent'>;

export const PaaVentTil = ({ sattPaaVent }: Props) => {
  if (sattPaaVent === null) {
    return null;
  }

  const { isExpired, from, to } = sattPaaVent;

  const prettyFrom = isoDateToPretty(from) ?? 'Ukjent dato';
  const prettyTo = isoDateToPretty(to) ?? 'Ukjent dato';

  return (
    <time
      className={isExpired ? 'text-ax-text-danger-subtle' : undefined}
      dateTime={to}
      title={`Satt på vent fra ${prettyFrom}`}
    >
      {prettyTo}
    </time>
  );
};

export const PaaVentReason = ({ sattPaaVent }: Props) => {
  const isMultiline = sattPaaVent?.reason?.includes('\n') ?? false;
  const [isTruncated, truncatedRef] = useIsTruncated(isMultiline);
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

  const span = (
    <span ref={truncatedRef} className="block max-w-60 truncate text-ax-medium">
      {reason}
    </span>
  );

  if (!isTruncated && !isMultiline) {
    return span;
  }

  return (
    <Tooltip content={reason} className="whitespace-pre-wrap">
      {span}
    </Tooltip>
  );
};
