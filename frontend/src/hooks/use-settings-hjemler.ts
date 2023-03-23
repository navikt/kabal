import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useGetSettingsQuery } from '@app/redux-api/bruker';
import { useHjemler } from '@app/simple-api-state/use-kodeverk';
import { IKodeverkValue } from '@app/types/kodeverk';

export const useSettingsHjemler = (): IKodeverkValue[] => {
  const { data: hjemler } = useHjemler();
  const { data: settings } = useGetSettingsQuery();

  if (typeof settings === 'undefined' || typeof hjemler === 'undefined') {
    return [];
  }

  return settings.hjemler.map((hjemmelId) => hjemler.find(({ id }) => id === hjemmelId)).filter(isNotUndefined);
};
