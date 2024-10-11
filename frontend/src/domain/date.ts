/* eslint-disable import/no-unused-modules */
import { pushLog } from '@app/observability';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/; // 2020-10-29
const isoTimeRegex = /^\d{2}:\d{2}:\d{2}\.?\d*$/; // 14:25:19.734593
const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d*$/; // 2020-10-29T14:25:19.734593

export type ISODate = string;
export type ISODateTime = string;
export type ISOTime = string;
export type prettyDate = string;
export type prettyDateTime = string;
export type prettyTime = string;

export const isoDateTimeToPretty = (isoDateTime: ISODateTime | null | undefined): prettyDateTime | null => {
  if (isoDateTime === null || isoDateTime === undefined || isoDateTime.length === 0) {
    return null;
  }

  if (!isoDateTimeRegex.test(isoDateTime)) {
    pushLog('Invalid ISO date time', { context: { isoDateTime } });
    console.warn('Invalid ISO date time', isoDateTime);

    return null;
  }

  const [isoDate, isoTime] = isoDateTime.split('T');

  if (isoDate === undefined || isoTime === undefined) {
    return null;
  }

  return `${_isoDateToPretty(isoDate)} ${_isoTimeToPretty(isoTime)}`;
};

export const isoDateTimeToPrettyDate = (isoDateTime: ISODateTime | null | undefined): prettyDateTime | null => {
  if (isoDateTime === null || isoDateTime === undefined || isoDateTime.length === 0) {
    return null;
  }

  if (!isoDateTimeRegex.test(isoDateTime)) {
    pushLog('Invalid ISO date time', { context: { isoDateTime } });
    console.warn('Invalid ISO date time', isoDateTime);

    return null;
  }

  const [isoDate] = isoDateTime.split('T');

  if (isoDate === undefined) {
    return null;
  }

  return _isoDateToPretty(isoDate);
};

export const isoTimeToPretty = (isoTime: ISOTime | null | undefined): prettyTime | null => {
  if (isoTime === null || isoTime === undefined || isoTime.length === 0) {
    return null;
  }

  if (!isoTimeRegex.test(isoTime)) {
    pushLog('Invalid ISO time', { context: { isoTime } });
    console.warn('Invalid ISO time', isoTime);

    return null;
  }

  return _isoTimeToPretty(isoTime);
};

// biome-ignore lint/style/noNonNullAssertion: String is guaranteed to be in correct format.
const _isoTimeToPretty = (isoTime: ISOTime): prettyTime => isoTime.split('.')[0]!;

/** Formats ISO date(time) as human readable. */
export const isoDateToPretty = (isoDate: ISODate | ISODateTime | null | undefined): prettyDate | null => {
  if (isoDate === null || isoDate === undefined || isoDate.length === 0) {
    return null;
  }

  const [date] = isoDate.split('T');

  if (date !== undefined && isoDateRegex.test(date)) {
    return _isoDateToPretty(date);
  }

  pushLog('Invalid ISO date', { context: { isoDate } });
  console.warn('Invalid ISO date', isoDate);

  return null;
};

const _isoDateToPretty = (isoDate: ISODate): prettyDate => isoDate.split('-').reverse().join('.');

const prettyRegex = /^\d{2}.\d{2}.\d{4}$/;

export const prettyDateToISO = (prettyDate: prettyDate | null | undefined): ISODate | null => {
  if (prettyDate === null || prettyDate === undefined || prettyDate.length === 0) {
    return null;
  }

  if (!prettyRegex.test(prettyDate)) {
    pushLog('Invalid pretty date', { context: { prettyDate } });
    console.warn('Invalid pretty date', prettyDate);

    return null;
  }

  return prettyDate.split('.').reverse().join('-');
};

export const formatLongDate = (year: number, month: number, day: number): string | null => {
  if (day < 1 || day > 31) {
    return null;
  }

  const monthName = MONTHS[month];

  if (monthName === undefined) {
    return null;
  }

  return `${day}. ${monthName} ${year}`;
};

const MONTHS = [
  'januar',
  'februar',
  'mars',
  'april',
  'mai',
  'juni',
  'juli',
  'august',
  'september',
  'oktober',
  'november',
  'desember',
];

export const zeroPad = (number: number, length = 2): string => {
  const string = number.toString();

  return string.length >= length ? string : '0'.repeat(length - string.length) + string;
};
