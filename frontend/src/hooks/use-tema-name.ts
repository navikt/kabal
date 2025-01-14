import { useTema } from '@app/simple-api-state/use-kodeverk';
import { useMemo } from 'react';

export const useTemaName = (temaId?: string | null): [string | undefined, boolean] => {
  const { data, isLoading } = useTema();

  return useMemo(() => {
    if (isLoading || data === undefined) {
      return [undefined, true];
    }

    return [data.find(({ id }) => id === temaId)?.navn, false];
  }, [data, isLoading, temaId]);
};
