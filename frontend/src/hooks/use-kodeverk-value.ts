import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useGetKodeverkQuery } from '../redux-api/kodeverk';
import { IKodeverk, ILovKildeToRegistreringshjemmel, IYtelse } from '../types/kodeverk';

export const useKodeverkValue = <K extends keyof IKodeverk>(
  key: K | typeof skipToken = skipToken
): IKodeverk[K] | undefined => {
  const { data } = useGetKodeverkQuery();

  if (key === skipToken || typeof data === 'undefined') {
    return undefined;
  }

  return data[key];
};

export const useKodeverkYtelse = (ytelseId: string | typeof skipToken = skipToken): IYtelse | undefined => {
  const data = useKodeverkValue(ytelseId === skipToken ? skipToken : 'ytelser');

  if (ytelseId === skipToken || typeof data === 'undefined') {
    return undefined;
  }

  return data.find(({ id }) => id === ytelseId);
};

export const useLovkildeToRegistreringshjemmelForYtelse = (
  ytelseId: string | typeof skipToken = skipToken
): ILovKildeToRegistreringshjemmel[] => useKodeverkYtelse(ytelseId)?.lovKildeToRegistreringshjemler ?? [];
