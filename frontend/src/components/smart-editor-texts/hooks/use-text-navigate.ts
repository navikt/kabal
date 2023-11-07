import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getPathPrefix } from '../functions/get-path-prefix';
import { useTextQuery } from './use-text-query';
import { useTextType } from './use-text-type';

type GoToTextFn = (id?: string) => void;

export const useTextNavigate = (): GoToTextFn => {
  const navigate = useNavigate();
  const query = useTextQuery();
  const textType = useTextType();
  const { search } = useLocation();

  const goToTextFn = useCallback(
    (id?: string) => {
      if (textType === undefined || query === undefined) {
        return;
      }

      const pathPrefix = getPathPrefix(textType);

      if (typeof id === 'undefined') {
        return navigate(`${pathPrefix}${search}`);
      }

      return navigate(`${pathPrefix}/${id}${search}`);
    },
    [textType, query, navigate, search],
  );

  return goToTextFn;
};
