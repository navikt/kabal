import type { IGetTextsParams } from '@app/types/common-text-types';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTextType } from './use-text-type';

export const useTextQuery = (): IGetTextsParams => {
  const [params] = useSearchParams();
  const textType = useTextType();

  const ytelseHjemmelIdList = params.get('ytelseHjemmelIdList');
  const utfallIdList = params.get('utfallIdList');
  const enhetIdList = params.get('enhetIdList');
  const templateSectionIdList = params.get('templateSectionIdList');

  return useMemo(() => {
    const q: IGetTextsParams = {
      ytelseHjemmelIdList: ytelseHjemmelIdList?.split(','),
      enhetIdList: enhetIdList?.split(','),
      templateSectionIdList: templateSectionIdList?.split(','),
      textType,
    };

    if (utfallIdList !== null) {
      q.utfallIdList = utfallIdList;
    }

    return q;
  }, [ytelseHjemmelIdList, enhetIdList, templateSectionIdList, textType, utfallIdList]);
};
