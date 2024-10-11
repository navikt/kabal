import type { IKodeverkValue } from '@app/types/kodeverk';
import { useMemo } from 'react';
import { useAvailableYtelserForEnhet } from './use-available-ytelser';

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
