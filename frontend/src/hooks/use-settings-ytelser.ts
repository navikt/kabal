import { useGetSettingsQuery } from '@/redux-api/bruker';
import { useLatestYtelser } from '@/simple-api-state/use-kodeverk';
import type { IYtelse } from '@/types/kodeverk';

export const useSettingsYtelser = (): IYtelse[] => {
  const { data, isSuccess } = useGetSettingsQuery();
  const { data: ytelser = [] } = useLatestYtelser();

  if (!isSuccess) {
    return [];
  }

  return ytelser.filter(({ id }) => data.ytelser.includes(id));
};
