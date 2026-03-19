import { useParams } from 'react-router-dom';
import { isLanguage, Language } from '@/types/texts/language';

export const useRedaktoerLanguage = () => {
  const { lang } = useParams();

  if (isLanguage(lang)) {
    return lang;
  }

  return Language.NB;
};
