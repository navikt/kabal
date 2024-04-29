import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { getPathPrefix } from '../functions/get-path-prefix';
import { useTextQuery } from './use-text-query';
import { useTextType } from './use-text-type';

type GoToTextFn = (id: string) => void;

export const useTextNavigate = (): GoToTextFn => {
  const navigate = useNavigate();
  const query = useTextQuery();
  const textType = useTextType();
  const { search } = useLocation();
  const lang = useRedaktoerLanguage();

  const goToTextFn = useCallback(
    (id: string) => {
      if (query === undefined) {
        return;
      }

      const pathPrefix = getPathPrefix(textType);

      return navigate(`${pathPrefix}/${lang}/${id}${search}`);
    },
    [query, textType, navigate, lang, search],
  );

  return goToTextFn;
};
