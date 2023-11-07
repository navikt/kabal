import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiQuery } from '@app/types/common-text-types';
import { useTextType } from './use-text-type';

type Query = Partial<ApiQuery>;

export const useTextQuery = (): Query => {
  const [params] = useSearchParams();
  const textType = useTextType();

  const ytelseHjemmelIdList = params.get('ytelseHjemmelIdList');
  const utfallIdList = params.get('utfallIdList');
  const enhetIdList = params.get('enhetIdList');
  const templateSectionIdList = params.get('templateSectionIdList');

  const query: Query = useMemo(
    () => ({
      ytelseHjemmelIdList: ytelseHjemmelIdList?.split(','),
      utfallIdList: utfallIdList ?? undefined,
      enhetIdList: enhetIdList?.split(','),
      templateSectionIdList: templateSectionIdList?.split(','),
      textType,
    }),
    [enhetIdList, ytelseHjemmelIdList, templateSectionIdList, textType, utfallIdList],
  );

  return query;
};
