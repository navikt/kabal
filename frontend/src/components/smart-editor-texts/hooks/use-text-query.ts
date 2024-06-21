import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IGetTextsParams } from '@app/types/common-text-types';
import { useTextType } from './use-text-type';

export const useTextQuery = (): IGetTextsParams => {
  const [params] = useSearchParams();
  const textType = useTextType();

  const ytelseHjemmelIdList = params.get('ytelseHjemmelIdList');
  const utfallIdList = params.get('utfallIdList');
  const enhetIdList = params.get('enhetIdList');
  const templateSectionIdList = params.get('templateSectionIdList');
  const trash = params.get('trash');

  return useMemo(() => {
    const q: IGetTextsParams = {
      ytelseHjemmelIdList: ytelseHjemmelIdList?.split(','),
      enhetIdList: enhetIdList?.split(','),
      templateSectionIdList: templateSectionIdList?.split(','),
      textType,
      trash: trash === 'true',
    };

    if (utfallIdList !== null) {
      q.utfallIdList = utfallIdList;
    }

    return q;
  }, [ytelseHjemmelIdList, enhetIdList, templateSectionIdList, textType, trash, utfallIdList]);
};
