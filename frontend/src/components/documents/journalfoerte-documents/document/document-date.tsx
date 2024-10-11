import { isoDateTimeToPrettyDate } from '@app/domain/date';
import type { HTMLAttributes } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  date: string | null;
}

export const DocumentDate = ({ date, ...attrs }: Props) =>
  date === null ? (
    'Ikke satt'
  ) : (
    <time dateTime={date} {...attrs}>
      {isoDateTimeToPrettyDate(date)}
    </time>
  );
