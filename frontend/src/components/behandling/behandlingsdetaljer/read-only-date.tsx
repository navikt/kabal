import { Label } from '@navikt/ds-react';
import { DateContainer } from '@/components/behandling/styled-components';
import { isoDateToPretty } from '@/domain/date';

interface Props {
  date: string | null;
  id: string;
  label: string;
}

export const ReadOnlyDate = ({ date, id, label }: Props) => (
  <DateContainer>
    <Label size="small" htmlFor={id}>
      {label}
    </Label>
    <span id={id}>{date === null ? 'Ikke satt' : isoDateToPretty(date)}</span>
  </DateContainer>
);
