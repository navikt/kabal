import { useMemo } from 'react';
import { useAvailableYtelser } from '@/hooks/use-available-ytelser';
import type { IYtelseHjemmel } from '@/types/kodeverk';

export const useAccessHjemler = (): IYtelseHjemmel[] => {
  const availableYtelser = useAvailableYtelser();

  return useMemo(() => {
    const seen = new Set<string>();
    const hjemler: IYtelseHjemmel[] = [];

    for (const { innsendingshjemler } of availableYtelser) {
      for (const hjemmel of innsendingshjemler) {
        if (seen.has(hjemmel.id)) {
          continue;
        }

        seen.add(hjemmel.id);
        hjemler.push(hjemmel);
      }
    }

    return hjemler;
  }, [availableYtelser]);
};
