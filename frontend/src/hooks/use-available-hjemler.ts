import { useMemo } from 'react';
import { useAvailableYtelserForEnhet } from '@/hooks/use-available-ytelser';
import type { IKodeverkValue } from '@/types/kodeverk';

export const useAvailableHjemler = () => {
  const ytelser = useAvailableYtelserForEnhet();

  const availableHjemler = useMemo(
    () =>
      ytelser
        .flatMap(({ innsendingshjemler }) => innsendingshjemler)
        .reduce<IKodeverkValue<string>[]>((acc, item) => {
          const exists = acc.some(({ id }) => id === item.id);

          if (!exists) {
            acc.push(item);
          }

          return acc;
        }, [])
        .sort(({ navn: a }, { navn: b }) => a.localeCompare(b)),
    [ytelser],
  );

  return availableHjemler;
};
