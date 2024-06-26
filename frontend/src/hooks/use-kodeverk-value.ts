import { skipToken } from '@reduxjs/toolkit/query';
import { useLatestYtelser, useSakstyperToUtfall, useYtelserAll } from '@app/simple-api-state/use-kodeverk';
import { ILovKildeToRegistreringshjemmel, IYtelse } from '@app/types/kodeverk';

const EMPTY_ARRAY: [] = [];

export const useSakstyper = () => {
  const { data: sakstyper = EMPTY_ARRAY } = useSakstyperToUtfall();

  return sakstyper;
};

export const useKodeverkYtelse = (ytelseId: string | typeof skipToken): [IYtelse | undefined, boolean] => {
  const { data, isLoading } = useLatestYtelser();

  if (ytelseId === skipToken || typeof data === 'undefined') {
    return [undefined, isLoading];
  }

  return [data.find(({ id }) => id === ytelseId), isLoading];
};

export const useLovkildeToRegistreringshjemmelForYtelse = (
  ytelseId: string | typeof skipToken = skipToken,
): ILovKildeToRegistreringshjemmel[] => useKodeverkYtelse(ytelseId)[0]?.lovKildeToRegistreringshjemler ?? EMPTY_ARRAY;

export const useAllLovkildeToRegistreringshjemmelForYtelse = (
  ytelseId: string | typeof skipToken = skipToken,
): ILovKildeToRegistreringshjemmel[] => {
  const { data = [] } = useYtelserAll();

  if (ytelseId === skipToken) {
    return EMPTY_ARRAY;
  }

  const ytelse = data.find(({ id }) => id === ytelseId);

  if (ytelse === undefined) {
    return EMPTY_ARRAY;
  }

  return ytelse.lovKildeToRegistreringshjemler;
};
