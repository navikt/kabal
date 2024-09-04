import { parse } from 'date-fns';
import { IBeskrivelse } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/type';

const HEADER_REGEX = /(\d{1,2}\.\d{1,2}\.\d{4} \d{1,2}:\d{1,2})\s+(.*)\(([A-Z]\d+), (\d+)\)/i;

export const parseHeader = (header: string): IBeskrivelse | null => {
  const match = HEADER_REGEX.exec(header);

  if (match === null) {
    return null;
  }

  const [, date, name, navIdent, enhet] = match;

  if (date === undefined || name === undefined || navIdent === undefined || enhet === undefined) {
    return null;
  }

  const parsedDateTime = parse(date, 'dd.MM.yyyy HH:mm', new Date());
  const trimmedName = name.trim();

  return {
    date: parsedDateTime,
    author: { name: trimmedName.length === 0 ? null : trimmedName, navIdent, enhet },
    content: '',
  };
};