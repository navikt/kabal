import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useMemo } from 'react';
import { useKodeverk } from '../simple-api-state/use-kodeverk';
import { IKodeverk, ILovKildeToRegistreringshjemmel, IYtelse } from '../types/kodeverk';

export const useKodeverkValue = <K extends keyof IKodeverk>(
  key: K | typeof skipToken = skipToken
): IKodeverk[K] | undefined => {
  const { data } = useKodeverk();

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

export const useLovkildeToRegistreringshjemmelForYtelser = (
  ytelseIds: string[] | typeof skipToken = skipToken
): ILovKildeToRegistreringshjemmel[] => {
  const data = useKodeverkValue('ytelser');

  return useMemo(() => {
    if (ytelseIds === skipToken || typeof data === 'undefined') {
      return [];
    }

    const ytelser = data.filter(({ id }) => ytelseIds.includes(id));
    return ytelser.reduce<ILovKildeToRegistreringshjemmel[]>((acc, { lovKildeToRegistreringshjemler }) => {
      const newHjemler = lovKildeToRegistreringshjemler.filter(
        ({ lovkilde }) => !acc.some((a) => a.lovkilde.id === lovkilde.id)
      );

      return [...acc, ...newHjemler];
    }, []);
  }, [data, ytelseIds]);
};
