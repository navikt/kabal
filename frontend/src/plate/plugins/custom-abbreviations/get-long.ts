import { ABBREVIATIONS } from '@app/custom-data/abbreviations';
import { autoCapitalise, capitaliseWord } from '@app/plate/plugins/custom-abbreviations/auto-capitalise';

export const getLong = (short: string, previous: string | undefined): string | null => {
  const lowerCaseShort = short.toLowerCase();
  const shortIsLowerCase = lowerCaseShort === short;

  if (shortIsLowerCase) {
    const long = ABBREVIATIONS.getAbbreviation(short);

    return long === undefined ? null : autoCapitalise(long, previous);
  }

  const lettersOnly = getLettersOnly(short);

  if (isAllCaps(lettersOnly)) {
    const uppercaseLong = ABBREVIATIONS.getAbbreviation(short);

    if (uppercaseLong === undefined) {
      const long = ABBREVIATIONS.getAbbreviation(lowerCaseShort);

      return long === undefined ? null : long.toUpperCase();
    }

    return autoCapitalise(uppercaseLong, previous);
  }

  if (isCapitalised(lettersOnly)) {
    const long = ABBREVIATIONS.getAbbreviation(lowerCaseShort);

    if (long !== undefined) {
      return capitaliseWord(long);
    }
  }

  const mixedCaseLong = ABBREVIATIONS.getAbbreviation(short);

  return mixedCaseLong === undefined ? null : autoCapitalise(mixedCaseLong, previous);
};

const LETTERS_ONLY_REGEX = /[^a-zæøå]/gi;
const getLettersOnly = (text: string): string => text.replaceAll(LETTERS_ONLY_REGEX, '');

const isAllCaps = (lettersOnly: string): boolean =>
  lettersOnly.length > 1 ? lettersOnly.toUpperCase() === lettersOnly : false;

const isCapitalised = (lettersOnly: string): boolean => {
  const firstLetter = lettersOnly.charAt(0);

  if (firstLetter !== firstLetter.toUpperCase()) {
    return false;
  }

  if (lettersOnly.length === 1) {
    return true;
  }

  const rest = lettersOnly.substring(1);

  return rest.toLowerCase() === rest;
};
