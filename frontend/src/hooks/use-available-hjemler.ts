import { useMemo } from 'react';
import { useGetSettingsQuery } from '../redux-api/bruker';
import { IKodeverkValue } from '../types/kodeverk';
import { useAvailableYtelser } from './use-available-ytelser';

export const useAvailableHjemler = () => {
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
