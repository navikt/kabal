import { useGetSettingsQuery } from '@/redux-api/bruker';
import { useHjemler } from '@/simple-api-state/use-kodeverk';
import type { IKodeverkValue } from '@/types/kodeverk';

export const useSettingsHjemler = (): IKodeverkValue[] => {
  const { data: hjemler } = useHjemler();
  const { data: settings, isSuccess } = useGetSettingsQuery();

  if (!isSuccess || hjemler === undefined) {
    return [];
  }

  return hjemler.filter(({ id }) => settings.hjemler.includes(id));
};
