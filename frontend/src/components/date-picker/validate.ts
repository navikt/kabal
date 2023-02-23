import { format, isAfter, isBefore, isValid, parse, subDays } from 'date-fns';
import { PRETTY_FORMAT } from './constants';

interface Options {
  dateString: string;
  defaultDate: Date;
  fromDate: Date;
  toDate: Date;
}

export const validateDateString = ({ dateString, defaultDate, fromDate, toDate }: Options): string | undefined => {
  if (dateString.length === 0) {
    return 'Dato må være satt';
  }

  const date = parse(dateString, PRETTY_FORMAT, defaultDate);
  const validFormat = isValid(date);
  const validRange = isAfter(date, subDays(fromDate, 1)) && isBefore(date, toDate);

  if (!validFormat) {
    return 'Ugyldig dato';
  }

  if (!validRange) {
    return `Dato må være mellom ${format(fromDate, PRETTY_FORMAT)} og ${format(toDate, PRETTY_FORMAT)}`;
  }

  return undefined;
};
