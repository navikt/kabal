import { Language } from '@app/types/texts/language';

type Content<T> = Record<Language, T>;

export const getLanguageContent = <T>(language: Language, versions: Content<T>): T => versions[language];
