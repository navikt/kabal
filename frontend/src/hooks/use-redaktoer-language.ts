import { isLanguage, Language } from '@app/types/texts/language';
import { useParams } from 'react-router-dom';

export const useRedaktoerLanguage = () => {
  const { lang } = useParams();

  if (isLanguage(lang)) {
    return lang;
  }

  return Language.NB;
};
