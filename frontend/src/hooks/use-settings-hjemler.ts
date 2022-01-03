import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { IKodeverkValue } from '../types/kodeverk';
import { useKodeverkValue } from './use-kodeverk-value';

export const useSettingsHjemler = (): IKodeverkValue[] => {
  const hjemler = useKodeverkValue('hjemler');
  const { data: userData } = useGetBrukerQuery();

  if (typeof userData === 'undefined' || typeof hjemler === 'undefined') {
    return [];
  }

  const settingsHjemler = userData.innstillinger.hjemler;

  if (settingsHjemler.length === 0) {
    return hjemler;
  }

  return settingsHjemler.map((hjemmelId) => hjemler.find(({ id }) => id === hjemmelId)).filter(isNotUndefined);
};
