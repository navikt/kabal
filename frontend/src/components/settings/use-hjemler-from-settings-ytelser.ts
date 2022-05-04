import { useMemo } from 'react';
import { useAvailableYtelser } from '../../hooks/use-available-ytelser';
import { useGetSettingsQuery } from '../../redux-api/bruker';
import { IKodeverkValue } from '../../types/kodeverk';

export const useHjemlerFromSettingsYtelser = () => {
  const { data } = useGetSettingsQuery();
  const ytelser = useAvailableYtelser();

  const availableHjemler = useMemo(
    () =>
      ytelser
        .filter((ytelse) => data?.ytelser.includes(ytelse.id))
        .flatMap(({ innsendingshjemler }) => innsendingshjemler)
        .reduce<IKodeverkValue<string>[]>((acc, item) => {
          const exists = acc.some(({ id }) => id === item.id);

          if (!exists) {
            acc.push(item);
          }

          return acc;
        }, [])
        .sort(({ navn: a }, { navn: b }) => a.localeCompare(b)),
    [data?.ytelser, ytelser]
  );

  return availableHjemler;
};
