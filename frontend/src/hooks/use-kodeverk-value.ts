import { skipToken } from '@reduxjs/toolkit/query';
import { useLatestYtelser, useSakstyperToUtfall } from '@app/simple-api-state/use-kodeverk';
import { ILovKildeToRegistreringshjemmel, IYtelse, SaksTypeEnum } from '@app/types/kodeverk';

const EMPTY_ARRAY: [] = [];

export const useSakstyper = () => {
  const { data: sakstyper = EMPTY_ARRAY } = useSakstyperToUtfall();

  return sakstyper.filter(({ id }) => id !== SaksTypeEnum.ANKE_I_TRYGDERETTEN);
};

export const useKodeverkYtelse = (ytelseId: string | typeof skipToken): IYtelse | undefined => {
  const { data } = useLatestYtelser();

  if (ytelseId === skipToken || typeof data === 'undefined') {
    return undefined;
  }

  return data.find(({ id }) => id === ytelseId);
};

export const useLovkildeToRegistreringshjemmelForYtelse = (
  ytelseId: string | typeof skipToken = skipToken,
): ILovKildeToRegistreringshjemmel[] => useKodeverkYtelse(ytelseId)?.lovKildeToRegistreringshjemler ?? EMPTY_ARRAY;
