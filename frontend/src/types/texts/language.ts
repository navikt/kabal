export enum Language {
  NB = 'nb',
  NN = 'nn',
}

export const UNTRANSLATED = 'untranslated';

export const LANGUAGES = [Language.NB, Language.NN];

export const isLanguage = (value: unknown): value is Language => LANGUAGES.some((lang) => lang === value);

export const LANGUAGE_NAMES = {
  [Language.NB]: 'Bokmål',
  [Language.NN]: 'Nynorsk',
};
