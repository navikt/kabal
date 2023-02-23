import { addYears, format, isAfter, isBefore, isValid, parse, subYears } from 'date-fns';
import { PRETTY_FORMAT } from './constants';
import { isDateParts, isEightChars, isFourChars, isSixChars } from './guards';

interface Options {
  userInput: string;
  fromDate: Date;
  toDate: Date;
  centuryThreshold: number;
}

export const parseUserInput = ({ userInput, fromDate, toDate, centuryThreshold }: Options): string => {
  const parts = userInput.split('.');

  // Prefix with reasonable century, e.g. 20 for 2022 and 19 for 1999.
  if (isDateParts(parts)) {
    const [dd, mm, yy] = parts;

    return `${dd.padStart(2, '0')}.${mm.padStart(2, '0')}.${getFullYear(yy, centuryThreshold)}`;
  }

  const chars = userInput.split('');

  // 211220 -> 21.12.2020
  if (isSixChars(chars)) {
    const [d1, d2, m1, m2, y1, y2] = chars;

    return `${d1}${d2}.${m1}${m2}.${getFullYear(`${y1}${y2}`, centuryThreshold)}`;
  }

  // 31122020 -> 31.12.2020
  if (isEightChars(chars)) {
    const [d1, d2, m1, m2, y1, y2, y3, y4] = chars;

    return `${d1}${d2}.${m1}${m2}.${y1}${y2}${y3}${y4}`;
  }

  // Current year if the date is in the past, otherwise previous year.
  // 3112 -> 31.12.2021
  if (isFourChars(chars)) {
    const [d1, d2, m1, m2] = chars;
    const dateObject = parse(`${d1}${d2}.${m1}${m2}`, 'dd.MM', new Date());

    if (!isValid(dateObject)) {
      return userInput;
    }

    if (isAfter(dateObject, toDate)) {
      return format(subYears(dateObject, 1), PRETTY_FORMAT);
    }

    if (isBefore(dateObject, fromDate)) {
      return format(addYears(dateObject, 1), PRETTY_FORMAT);
    }

    return format(dateObject, PRETTY_FORMAT);
  }

  return userInput;
};

const getFullYear = (year: string, centuryThreshold: number): string => {
  if (year.length === 2) {
    const century = Number.parseInt(year, 10) <= centuryThreshold ? '20' : '19';

    return `${century}${year}`;
  }

  return year;
};
