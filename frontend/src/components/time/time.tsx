import { format } from 'date-fns';
import React from 'react';
import { ISO_DATETIME_FORMAT, PRETTY_DATETIME_FORMAT } from '@app/components/date-picker/constants';

interface Props {
  date: Date;
  className?: string;
}
export const Time = ({ date, className }: Props) => (
  <time className={className} dateTime={format(date, ISO_DATETIME_FORMAT)}>
    {format(date, PRETTY_DATETIME_FORMAT)}
  </time>
);
