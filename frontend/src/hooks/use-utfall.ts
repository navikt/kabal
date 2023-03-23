import { useMemo } from 'react';
import { useSakstyperToUtfall } from '@app/simple-api-state/use-kodeverk';
import { IKodeverkSimpleValue, SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';

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
