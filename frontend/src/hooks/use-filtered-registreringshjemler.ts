import { useMemo } from 'react';
import {
  type ILovKildeToRegistreringshjemler,
  useLovKildeToRegistreringshjemler,
} from '@/simple-api-state/use-kodeverk';
import type { IYtelse } from '@/types/kodeverk';

export const useFilteredRegistreringshjemler = (ytelser: IYtelse[]): ILovKildeToRegistreringshjemler[] => {
  const { data: sortedLovkildeToRegistreringshjemler = [] } = useLovKildeToRegistreringshjemler();

  return useMemo<ILovKildeToRegistreringshjemler[]>(() => {
    const allowedIds = new Set<string>();

    for (const { lovKildeToRegistreringshjemler } of ytelser) {
      for (const { registreringshjemler } of lovKildeToRegistreringshjemler) {
        for (const { id } of registreringshjemler) {
          allowedIds.add(id);
        }
      }
    }

    const result: ILovKildeToRegistreringshjemler[] = [];

    for (const lovkilde of sortedLovkildeToRegistreringshjemler) {
      const filteredHjemler = lovkilde.registreringshjemler.filter(({ id: hjemmelId }) => allowedIds.has(hjemmelId));

      if (filteredHjemler.length === 0) {
        continue;
      }

      result.push({ ...lovkilde, registreringshjemler: filteredHjemler });
    }

    return result;
  }, [sortedLovkildeToRegistreringshjemler, ytelser]);
};
