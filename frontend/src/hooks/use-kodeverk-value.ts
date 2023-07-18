import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useKodeverk, useLatestYtelser, useSakstyperToUtfall } from '@app/simple-api-state/use-kodeverk';
import { IKodeverk, ILovKildeToRegistreringshjemmel, IYtelse, SaksTypeEnum } from '@app/types/kodeverk';

export const useKodeverkValue = <K extends keyof IKodeverk>(
  key: K | typeof skipToken = skipToken,
): IKodeverk[K] | undefined => {
  const { data } = useKodeverk();

  if (key === skipToken || typeof data === 'undefined') {
    return undefined;
  }

  return data[key];
};

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
