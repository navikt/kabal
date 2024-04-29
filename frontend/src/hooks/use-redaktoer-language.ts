import { useParams } from 'react-router-dom';
import { Language, isLanguage } from '@app/types/texts/language';

export const useRedaktoerLanguage = () => {
  const { lang } = useParams();

  if (isLanguage(lang)) {
    return lang;
  }

  return Language.NB;
};
