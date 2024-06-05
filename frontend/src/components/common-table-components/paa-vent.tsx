import { styled } from 'styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { IOppgave } from '@app/types/oppgaver';

type Props = Pick<IOppgave, 'sattPaaVent'>;

export const PaaVentTil = ({ sattPaaVent }: Props) => {
  if (sattPaaVent === null) {
    return null;
  }

  const { isExpired, from, to } = sattPaaVent;

  const prettyFrom = isoDateToPretty(from) ?? 'Ukjent dato';
  const prettyTo = isoDateToPretty(to) ?? 'Ukjent dato';

  return (
    <Time dateTime={to} title={`Satt på vent fra ${prettyFrom}`} $isExpired={isExpired}>
      {prettyTo}
    </Time>
  );
};

const Time = styled.time<{ $isExpired: boolean }>`
  color: ${({ $isExpired }) => ($isExpired ? 'var(--a-surface-danger)' : 'unset')};
`;

const Ellipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 130px;
`;

export const PaaVentReason = ({ sattPaaVent }: Props) => {
  if (sattPaaVent === null) {
    return null;
  }

  return <Ellipsis title={sattPaaVent.reason}>{sattPaaVent.reason}</Ellipsis>;
};
