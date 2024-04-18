export enum Language {
  NB = 'nb',
  NN = 'nn',
}
export const LANGUAGES = Object.values(Language);

export const isLanguage = (value: unknown): value is Language => LANGUAGES.some((lang) => lang === value);
