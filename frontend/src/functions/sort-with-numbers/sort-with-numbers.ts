/**
 * Sorts strings with numbers.
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
export const sortWithNumbers = (a: string, b: string): number => {
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

    const aPartIsString = typeof aPart === 'string';
    const bPartIsString = typeof bPart === 'string';

    if (aPartIsString && bPartIsString) {
      const diff = aPart.localeCompare(bPart);

      if (diff !== 0) {
        return diff;
      }
    }

    if (!(aPartIsString || bPartIsString)) {
      const diff = aPart - bPart;

      if (diff !== 0) {
        return diff;
      }
    }

    if (!aPartIsString && bPartIsString) {
      return -1;
    }

    if (aPartIsString && !bPartIsString) {
      return 1;
    }
  }

  return 0;
};

const SPLIT_REGEX = /(\d+)/gi;

const split = (value: string): (string | number)[] => {
  const parts = value.split(SPLIT_REGEX);
  const result: (string | number)[] = [];

  for (const part of parts) {
    if (part.length === 0) {
      continue;
    }

    const parsedNumber = Number.parseInt(part, 10);

    result.push(Number.isNaN(parsedNumber) ? part : parsedNumber);
  }

  return result;
};
