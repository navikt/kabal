import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { getPathPrefix } from '../functions/get-path-prefix';
import { useTextType } from './use-text-type';

type GoToTextFn = (id: string, trash?: boolean) => void;

export const useTextNavigate = (): GoToTextFn => {
  const navigate = useNavigate();
  const textType = useTextType();
  const [searchParams] = useSearchParams();

  const lang = useRedaktoerLanguage();

  const goToTextFn = useCallback<GoToTextFn>(
    (id, trash) => {
      const pathPrefix = getPathPrefix(textType);

      if (trash === true) {
        searchParams.set('trash', 'true');
      } else {
        searchParams.delete('trash');
      }

      return navigate(`${pathPrefix}/${lang}/${id}${searchParams.toString()}`);
    },
    [textType, navigate, lang, searchParams],
  );

  return goToTextFn;
};
