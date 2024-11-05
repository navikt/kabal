/**
 * Sorts strings with numbers and ordinals.
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
export const sortWithOrdinals = (a: string, b: string): number => {
  const aParts = split(a);
  const bParts = split(b);

  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    const aPart = aParts[i];
    const bPart = bParts[i];

    if (aPart === undefined) {
      return -1;
    }

    if (bPart === undefined) {
      return 1;
    }

    let diff = 0;
    const aPartIsString = typeof aPart === 'string';
    const bPartIsString = typeof bPart === 'string';

    if (aPartIsString && bPartIsString) {
      const aPartOrdinalValue = ORDINALS.indexOf(aPart);
      const bPartOrdinalValue = ORDINALS.indexOf(bPart);
      const aPartIsOrdinal = aPartOrdinalValue !== -1;
      const bPartIsOrdinal = bPartOrdinalValue !== -1;

      if (aPartIsOrdinal && !bPartIsOrdinal) {
        return -1;
      }

      if (!aPartIsOrdinal && bPartIsOrdinal) {
        return 1;
      }

      diff = aPartIsOrdinal && bPartIsOrdinal ? aPartOrdinalValue - bPartOrdinalValue : aPart.localeCompare(bPart);
    }

    if (!(aPartIsString || bPartIsString)) {
      diff = aPart - bPart;
    }

    if (!aPartIsString && bPartIsString) {
      return -1;
    }

    if (aPartIsString && !bPartIsString) {
      return 1;
    }

    if (diff === 0) {
      continue;
    }

    return diff;
  }

  if (aParts.length < bParts.length) {
    return -1;
  }

  return 0; // Strings are equal.
};

const SPLIT_REGEX = /(\d+|\s+)/gi;
const REPLACE_REGEX = /§{2,}/gi;
const REMOVE_REGEX = /[()]/gi;

const split = (value: string): (string | number)[] => {
  const parts = value.replaceAll(REMOVE_REGEX, '').split(SPLIT_REGEX);
  const result: (string | number)[] = [];

  for (const rawPart of parts) {
    const part = rawPart.trim().replaceAll(REPLACE_REGEX, '§');

    if (part.length === 0) {
      continue;
    }

    const parsedNumber = Number.parseInt(part, 10);

    result.push(Number.isNaN(parsedNumber) ? part : parsedNumber);
  }

  return result;
};

const ORDINALS = [
  'første',
  'andre',
  'tredje',
  'fjerde',
  'femte',
  'sjette',
  'sjuende',
  'syvende',
  'åttende',
  'niende',
  'tiende',
  'ellevte',
  'tolvte',
  'trettende',
  'fjortende',
  'femtende',
  'sekstende',
  'syttende',
  'søttende',
  'attende',
  'nittende',
  'tjuende',
  'tyvende',

  'jan',
  'feb',
  'mar',
  'apr',
  'mai',
  'jun',
  'jul',
  'aug',
  'sep',
  'okt',
  'nov',
  'des',

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
