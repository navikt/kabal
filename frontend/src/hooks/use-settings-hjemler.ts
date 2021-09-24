import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { IKodeverkVerdi, useGetKodeverkQuery } from '../redux-api/kodeverk';

export const useSettingsHjemler = (): IKodeverkVerdi[] => {
  const { data: kodeverk } = useGetKodeverkQuery();
  const { data: userData } = useGetBrukerQuery();

  if (typeof userData === 'undefined' || typeof kodeverk === 'undefined') {
    return [];
  }

  const settingsHjemler = userData.innstillinger.hjemler;
  const allHjemler = kodeverk.hjemmel;

  if (settingsHjemler.length === 0) {
    return allHjemler;
  }

  return settingsHjemler.map((hjemmelId) => allHjemler.find(({ id }) => id === hjemmelId)).filter(isNotUndefined);
};
