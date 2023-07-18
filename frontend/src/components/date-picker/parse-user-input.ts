import { addYears, format, isAfter, isBefore, isValid, parse, subYears } from 'date-fns';
import { PRETTY_FORMAT } from '@app/components/date-picker/constants';
import { isDateParts, isEightChars, isFourChars, isSixChars } from './guards';

const DELIMITERS = ['.', '-', '/'];

export const parseUserInput = (input: string, fromDate: Date, toDate: Date, centuryThreshold: number): string => {
  for (const delimiter of DELIMITERS) {
    const parsed = customParse(input, fromDate, toDate, centuryThreshold, delimiter);

    if (parsed !== null) {
      return parsed;
    }
  }

  return input;
};

const customParse = (
  input: string,
  fromDate: Date,
  toDate: Date,
  centuryThreshold: number,
  delimiter: string,
): string | null => {
  const parts = input.split(delimiter);

  // Prefix with reasonable century, e.g. 20 for 2022 and 19 for 1999.
  if (isDateParts(parts)) {
    const [first, second, third] = parts;

    if (first.length === 4) {
      return `${third.padStart(2, '0')}.${second.padStart(2, '0')}.${first}`;
    }

    return `${first.padStart(2, '0')}.${second.padStart(2, '0')}.${getFullYear(third, centuryThreshold)}`;
  }

  const chars = input.split('');

  // 211220 -> 21.12.2020
  if (isSixChars(chars)) {
    const [d1, d2, m1, m2, y1, y2] = chars;
    const dateString = `${d1}${d2}.${m1}${m2}.${getFullYear(`${y1}${y2}`, centuryThreshold)}`;

    return dateString;
  }

  // 31122020 -> 31.12.2020
  if (isEightChars(chars)) {
    const [d1, d2, m1, m2, y1, y2, y3, y4] = chars;
    const dateString = `${d1}${d2}.${m1}${m2}.${y1}${y2}${y3}${y4}`;

    return dateString;
  }

  // Current year if the date is in the past, otherwise previous year.
  // 3112 -> 31.12.2021
  if (isFourChars(chars)) {
    const [d1, d2, m1, m2] = chars;
    const dateObject = parse(`${d1}${d2}.${m1}${m2}`, 'dd.MM', new Date());

    if (!isValid(dateObject)) {
      return input;
    }

    if (isAfter(dateObject, toDate)) {
      const afterDate = format(subYears(dateObject, 1), PRETTY_FORMAT);

      return afterDate;
    }

    if (isBefore(dateObject, fromDate)) {
      const beforeDate = format(addYears(dateObject, 1), PRETTY_FORMAT);

      return beforeDate;
    }

    return format(dateObject, PRETTY_FORMAT);
  }

  return null;
};

const getFullYear = (year: string, centuryThreshold: number): string => {
  if (year.length === 2) {
    const century = Number.parseInt(year, 10) <= centuryThreshold ? '20' : '19';

    return `${century}${year}`;
  }

  return year;
};
