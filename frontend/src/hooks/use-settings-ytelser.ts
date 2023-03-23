import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useGetSettingsQuery } from '@app/redux-api/bruker';
import { IKodeverkSimpleValue } from '@app/types/kodeverk';
import { useAvailableYtelser } from './use-available-ytelser';

export const useSettingsYtelser = (): IKodeverkSimpleValue[] => {
  const { data } = useGetSettingsQuery();
  const ytelser = useAvailableYtelser();

  if (typeof data === 'undefined' || typeof ytelser === 'undefined') {
    return [];
  }

  return data.ytelser.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
};
