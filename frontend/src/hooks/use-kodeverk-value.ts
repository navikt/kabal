import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useGetKodeverkQuery } from '../redux-api/kaka-kodeverk';
import { IKakaKodeverk, IKakaKodeverkValue, SakstypeEnum, UtfallEnum } from '../redux-api/kaka-kodeverk-types';

export const useKodeverkValue = <K extends keyof IKakaKodeverk>(
  key: K | typeof skipToken = skipToken
): IKakaKodeverk[K] | undefined => {
  const { data } = useGetKodeverkQuery(key === skipToken ? skipToken : undefined);

  if (key === skipToken || typeof data === 'undefined') {
    return undefined;
  }

  return data[key];
};

export const useKodeverkUtfall = (
  utfallId: string | typeof skipToken = skipToken
): IKakaKodeverkValue<UtfallEnum> | undefined => {
  const data = useKodeverkValue(utfallId === skipToken ? skipToken : 'utfall');

  if (utfallId === skipToken || typeof data === 'undefined') {
    return undefined;
  }

  return data.find(({ id }) => id === utfallId);
};

export const useKodeverkHjemmel = (
  hjemmelId: string | typeof skipToken = skipToken
): IKakaKodeverkValue | undefined => {
  const data = useKodeverkValue(hjemmelId === skipToken ? skipToken : 'hjemler');

  if (hjemmelId === skipToken || typeof data === 'undefined') {
    return undefined;
  }

  return data.find(({ id }) => id === hjemmelId);
};

export const useKodeverkSakstype = (
  sakstypeId: string | typeof skipToken = skipToken
): IKakaKodeverkValue<SakstypeEnum> | undefined => {
  const data = useKodeverkValue(sakstypeId === skipToken ? skipToken : 'sakstyper');

  if (sakstypeId === skipToken || typeof data === 'undefined') {
    return undefined;
  }

  return data.find(({ id }) => id === sakstypeId);
};
