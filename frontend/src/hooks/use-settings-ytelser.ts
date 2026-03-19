import { isNotUndefined } from '@/functions/is-not-type-guards';
import { useAvailableYtelser } from '@/hooks/use-available-ytelser';
import { useGetSettingsQuery } from '@/redux-api/bruker';
import type { IKodeverkSimpleValue } from '@/types/kodeverk';

export const useSettingsYtelser = (): IKodeverkSimpleValue[] => {
  const { data } = useGetSettingsQuery();
  const ytelser = useAvailableYtelser();

  if (typeof data === 'undefined' || typeof ytelser === 'undefined') {
    return [];
  }

  return data.ytelser.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
};
