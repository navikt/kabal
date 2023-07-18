export const isDateParts = (parts: string[]): parts is [string, string, string] => parts.length === 3;

export const isFourChars = (parts: string[]): parts is [string, string, string, string] => parts.length === 4;

export const isSixChars = (parts: string[]): parts is [string, string, string, string, string, string] =>
  parts.length === 6;

export const isEightChars = (
  parts: string[],
): parts is [string, string, string, string, string, string, string, string] => parts.length === 8;
