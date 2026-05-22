import { useMemo } from 'react';
import { useHjemler } from '@/simple-api-state/use-kodeverk';
import type { IInnsendingshjemmel } from '@/types/kodeverk';

const EMPTY_LIST: IInnsendingshjemmel[] = [];

export const useAllActiveHjemler = () => {
  const { data: hjemler } = useHjemler();

  return useMemo(() => {
    if (hjemler === undefined) {
      return EMPTY_LIST;
    }

    return hjemler.filter(({ deprecated }) => !deprecated);
  }, [hjemler]);
};
