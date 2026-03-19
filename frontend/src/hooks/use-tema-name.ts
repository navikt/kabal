import { useMemo } from 'react';
import { useTema } from '@/simple-api-state/use-kodeverk';

export const useTemaName = (temaId: string): [string | undefined, boolean] => {
  const { data, isLoading } = useTema();

  return useMemo(() => {
    if (isLoading || data === undefined) {
      return [undefined, true];
    }

    return [data.find(({ id }) => id === temaId)?.navn, false];
  }, [data, isLoading, temaId]);
};
