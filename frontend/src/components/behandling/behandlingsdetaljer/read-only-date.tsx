import { DateContainer } from '@app/components/behandling/styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { Label } from '@navikt/ds-react';

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
