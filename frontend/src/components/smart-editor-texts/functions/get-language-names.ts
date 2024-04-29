import { LANGUAGE_NAMES, Language } from '@app/types/texts/language';

export const getLanguageNames = (languages: Language[]): string => {
  const names = languages.map((v) => LANGUAGE_NAMES[v].toLowerCase());

  const [first, ...rest] = names;

  if (first === undefined) {
    return '';
  }

  if (rest.length === 0) {
    return first;
  }

  const last = rest.pop();

  if (rest.length === 0) {
    return `${first} og ${last}`;
  }

  return `${first}, ${rest.join(', ')} og ${last}`;
};
