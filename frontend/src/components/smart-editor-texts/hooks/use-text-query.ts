import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiQuery } from '@app/types/texts/texts';
import { useTextType } from './use-text-type';

type Query = Partial<ApiQuery>;

export const useTextQuery = (): Query => {
  const [params] = useSearchParams();
  const textType = useTextType();

  const ytelseHjemmelList = params.get('ytelseHjemmelList');
  const utfallSet = params.get('utfall');
  const enheter = params.get('enheter');
  const templateSectionList = params.get('templateSectionList');

  const query: Query = useMemo(
    () => ({
      ytelseHjemmelList: ytelseHjemmelList?.split(','),
      utfall: utfallSet ?? undefined,
      enheter: enheter?.split(','),
      templateSectionList: templateSectionList?.split(','),
      textType,
    }),
    [enheter, ytelseHjemmelList, templateSectionList, textType, utfallSet],
  );

  return query;
};
