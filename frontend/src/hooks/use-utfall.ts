import { useSakstyperToUtfall } from '@app/simple-api-state/use-kodeverk';
import type { IKodeverkSimpleValue, SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { useMemo } from 'react';

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
