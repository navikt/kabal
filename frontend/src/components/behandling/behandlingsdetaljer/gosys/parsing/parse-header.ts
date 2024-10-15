import {
  type GosysBeskrivelseEntry,
  GosysEntryAuthorType,
  type GosysEntryEmployee,
  type GosysEntrySystem,
} from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/type';
import { isValid, parse } from 'date-fns';

const HEADER_REGEX = /(\d{1,2}\.\d{1,2}\.\d{4} \d{1,2}:\d{1,2})\s+(.*)\(([\w,-\s]+)\)/i;

export const simpleHeaderPrecheck = (header: string): boolean =>
  header.length >= 20 && header.startsWith('--') && header.endsWith('--');

export const parseHeader = (header: string): GosysBeskrivelseEntry | null => {
  if (!simpleHeaderPrecheck(header)) {
    return null;
  }

  const match = HEADER_REGEX.exec(header);

  if (match === null) {
    return null;
  }

  const [, date, name, author] = match;

  if (date === undefined || name === undefined || author === undefined) {
    return null;
  }

  const parsedDateTime = parse(date, 'dd.MM.yyyy HH:mm', new Date());

  if (!isValid(parsedDateTime)) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    date: parsedDateTime,
    author: getAuthor(author, name.trim()),
    content: '',
  };
};

const getAuthor = (author: string, name: string): GosysEntryEmployee | GosysEntrySystem | null => {
  const authorParts = author.split(',');

  if (authorParts.length === 1) {
    return {
      type: GosysEntryAuthorType.SYSTEM,
      name: author,
    };
  }

  const [navIdent, enhet] = authorParts;

  if (navIdent === undefined || enhet === undefined) {
    return null;
  }

  return {
    type: GosysEntryAuthorType.EMPLOYEE,
    name: name.length === 0 ? null : name,
    navIdent: navIdent.toUpperCase(),
    enhet: enhet.trim(),
  };
};
