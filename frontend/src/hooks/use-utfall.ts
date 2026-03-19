import { useMemo } from 'react';
import { useSakstyperToUtfall } from '@/simple-api-state/use-kodeverk';
import type { IKodeverkSimpleValue, SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';

export const useUtfall = (type: SaksTypeEnum): [IKodeverkSimpleValue<UtfallEnum>[], boolean] => {
  const { data: sakstyperToUtfall } = useSakstyperToUtfall();

  return useMemo(() => {
    if (sakstyperToUtfall === undefined) {
      return [[], true];
    }

    const utfall = sakstyperToUtfall.find(({ id }) => id === type)?.utfall ?? [];

    return [utfall, false];
  }, [sakstyperToUtfall, type]);
};
