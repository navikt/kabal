import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { IKodeverk, ILovKildeToRegistreringshjemmel, IYtelse, useGetKodeverkQuery } from '../redux-api/kodeverk';
import { OppgaveType } from '../redux-api/oppgavebehandling-common-types';

export const useKodeverkValue = <K extends keyof IKodeverk>(
  key: K | typeof skipToken = skipToken,
  type: OppgaveType
): IKodeverk[K] | undefined => {
  const { data } = useGetKodeverkQuery(key === skipToken ? skipToken : type);

  if (key === skipToken || typeof data === 'undefined') {
    return undefined;
  }

  return data[key];
};

export const useKodeverkYtelse = (
  ytelseId: string | typeof skipToken = skipToken,
  type: OppgaveType
): IYtelse | undefined => {
  const data = useKodeverkValue(ytelseId === skipToken ? skipToken : 'ytelser', type);

  if (ytelseId === skipToken || typeof data === 'undefined') {
    return undefined;
  }

  return data.find(({ id }) => id === ytelseId);
};

export const useLovkildeToRegistreringshjemmelForYtelse = (
  ytelseId: string | typeof skipToken = skipToken,
  type: OppgaveType
): ILovKildeToRegistreringshjemmel[] => useKodeverkYtelse(ytelseId, type)?.lovKildeToRegistreringshjemler ?? [];
