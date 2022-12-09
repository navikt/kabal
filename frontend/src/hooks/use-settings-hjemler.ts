import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetSettingsQuery } from '../redux-api/bruker';
import { useHjemler } from '../simple-api-state/use-kodeverk';
import { IKodeverkValue } from '../types/kodeverk';

export const useSettingsHjemler = (): IKodeverkValue[] => {
  const { data: hjemler } = useHjemler();
  const { data: settings } = useGetSettingsQuery();

  if (typeof settings === 'undefined' || typeof hjemler === 'undefined') {
    return [];
  }

  return settings.hjemler.map((hjemmelId) => hjemler.find(({ id }) => id === hjemmelId)).filter(isNotUndefined);
};
