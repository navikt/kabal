import { isNotUndefined } from '@/functions/is-not-type-guards';
import { useGetSettingsQuery } from '@/redux-api/bruker';
import { useSimpleYtelser } from '@/simple-api-state/use-kodeverk';
import type { IKodeverkSimpleValue } from '@/types/kodeverk';

export const useSettingsYtelser = (): IKodeverkSimpleValue[] => {
  const { data, isSuccess } = useGetSettingsQuery();
  const { data: ytelser = [] } = useSimpleYtelser();

  if (!isSuccess) {
    return [];
  }

  return data.ytelser.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
};
