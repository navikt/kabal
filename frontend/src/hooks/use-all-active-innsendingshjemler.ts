import { useMemo } from 'react';
import { useInnsendingshjemler } from '@/simple-api-state/use-kodeverk';
import type { IInnsendingshjemmel } from '@/types/kodeverk';

const EMPTY_LIST: IInnsendingshjemmel[] = [];

export const useAllActiveInnsendingshjemler = () => {
  const { data: hjemler } = useInnsendingshjemler();

  return useMemo(() => {
    if (hjemler === undefined) {
      return EMPTY_LIST;
    }

    return hjemler.filter(({ deprecated }) => !deprecated);
  }, [hjemler]);
};
