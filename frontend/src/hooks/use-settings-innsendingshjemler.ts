import { useSettingsYtelser } from '@/hooks/use-settings-ytelser';
import { useGetSettingsQuery } from '@/redux-api/bruker';
import type { IYtelseInnsendingshjemmel } from '@/types/kodeverk';

export const useSettingsInnsendingshjemler = (): IYtelseInnsendingshjemmel[] => {
  const userYtelser = useSettingsYtelser();
  const { data: settings, isSuccess } = useGetSettingsQuery();

  if (!isSuccess) {
    return [];
  }

  const hjemler: IYtelseInnsendingshjemmel[] = [];

  for (const { innsendingshjemler } of userYtelser) {
    for (const hjemmel of innsendingshjemler) {
      if (!settings.hjemler.includes(hjemmel.id)) {
        continue;
      }

      if (hjemler.some(({ id }) => id === hjemmel.id)) {
        continue;
      }

      hjemler.push(hjemmel);
    }
  }

  return hjemler;
};
