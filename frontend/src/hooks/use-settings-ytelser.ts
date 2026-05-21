import { useGetSettingsQuery } from '@/redux-api/bruker';
import { useSimpleYtelser } from '@/simple-api-state/use-kodeverk';
import type { IKodeverkSimpleValue } from '@/types/kodeverk';

export const useSettingsYtelser = (): IKodeverkSimpleValue[] => {
  const { data, isSuccess } = useGetSettingsQuery();
  const { data: ytelser = [] } = useSimpleYtelser();

  if (!isSuccess) {
    return [];
  }

  return ytelser.filter(({ id }) => data.ytelser.includes(id));
};
