import { useMemo } from 'react';
import { useSakstyperToUtfall } from '../simple-api-state/use-kodeverk';
import { IKodeverkSimpleValue, SaksTypeEnum, UtfallEnum } from '../types/kodeverk';

export const useUtfall = (type?: SaksTypeEnum): [IKodeverkSimpleValue<UtfallEnum>[], boolean] => {
  const { data: sakstyperToUtfall } = useSakstyperToUtfall();

  return useMemo(() => {
    if (typeof sakstyperToUtfall === 'undefined' || typeof type === 'undefined') {
      return [[], true];
    }

    const utfall = sakstyperToUtfall.find(({ id }) => id === type)?.utfall ?? [];

    return [utfall, false];
  }, [sakstyperToUtfall, type]);
};
