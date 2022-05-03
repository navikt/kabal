import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetSettingsQuery } from '../redux-api/bruker';
import { IKodeverkSimpleValue } from '../types/kodeverk';
import { useAvailableYtelser } from './use-available-ytelser';

export const useSettingsYtelser = (): IKodeverkSimpleValue[] => {
  const { data } = useGetSettingsQuery();
  const ytelser = useAvailableYtelser();

  if (typeof data === 'undefined' || typeof ytelser === 'undefined') {
    return [];
  }

  return data.ytelser.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
};
