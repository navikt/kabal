import { useMemo } from 'react';
import { IKodeverkValue } from '../types/kodeverk';
import { useAvailableYtelser } from './use-available-ytelser';

export const useAvailableHjemler = () => {
  const ytelser = useAvailableYtelser();

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
    [ytelser]
  );

  return availableHjemler;
};
