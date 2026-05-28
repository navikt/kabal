import { useMemo } from 'react';
import { useAvailableYtelser } from '@/hooks/use-available-ytelser';
import type { IYtelseInnsendingshjemmel } from '@/types/kodeverk';

export const useAccessInnsendingshjemler = (): IYtelseInnsendingshjemmel[] => {
  const availableYtelser = useAvailableYtelser();

  return useMemo(() => {
    const seen = new Set<string>();
    const hjemler: IYtelseInnsendingshjemmel[] = [];

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
