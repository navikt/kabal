import { useParams } from 'react-router';
import { Language, isLanguage } from '@app/types/texts/language';

export const useLanguageRedaktoer = (): Language | null => {
  const { lang } = useParams();

  if (isLanguage(lang)) {
    return lang;
  }

  return null;
};
