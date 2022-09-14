import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useKodeverk } from '../simple-api-state/use-kodeverk';
import { IKodeverk, ILovKildeToRegistreringshjemmel, IYtelse, OppgaveType } from '../types/kodeverk';

export const useKodeverkValue = <K extends keyof IKodeverk>(
  key: K | typeof skipToken = skipToken
): IKodeverk[K] | undefined => {
  const { data } = useKodeverk();

  if (key === skipToken || typeof data === 'undefined') {
    return undefined;
  }

  return data[key];
};

export const useSakstyper = () => {
  const sakstyper = useKodeverkValue('sakstyper') ?? [];

  return sakstyper.filter(({ id }) => id !== OppgaveType.ANKE_I_TRYGDERETTEN);
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
