import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { queryStringify } from '@app/functions/query-string';
import { getPathPrefix } from '../functions/get-path-prefix';
import { useTextQuery } from './use-text-query';
import { useTextType } from './use-text-type';

type GoToTextFn = (id?: string) => void;

export const useTextNavigate = (): GoToTextFn => {
  const navigate = useNavigate();
  const query = useTextQuery();
  const textType = useTextType();

  const goToTextFn = useCallback(
    (id?: string) => {
      if (textType === undefined || query === undefined) {
        return;
      }

      const pathPrefix = getPathPrefix(textType);

      if (typeof id === 'undefined') {
        return navigate(`${pathPrefix}${queryStringify(query)}`);
      }

      return navigate(`${pathPrefix}/${id}${queryStringify(query)}`);
    },
    [textType, navigate, query]
  );

  return goToTextFn;
};
