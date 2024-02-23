export const getFullYear = (year: string, centuryThreshold: number): string => {
  if (year.length === 2) {
    const century = Number.parseInt(year, 10) <= centuryThreshold ? '20' : '19';

    return `${century}${year}`;
  }

  return year;
};

export const isDateParts = (parts: string[]): parts is [string, string, string] => parts.length === 3;

export const isFourChars = (parts: string[]): parts is [string, string, string, string] => parts.length === 4;
export const isSixChars = (parts: string[]): parts is [string, string, string, string, string, string] =>
  parts.length === 6;
export const isEightChars = (
  parts: string[],
): parts is [string, string, string, string, string, string, string, string] => parts.length === 8;
