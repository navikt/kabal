import { useMemo } from 'react';
import { useKodeverk } from '../simple-api-state/use-kodeverk';

type Hjemler = Record<string, string>;

const useRegistreringshjemler = (): Hjemler | undefined => {
  const { data, isLoading } = useKodeverk();

  return useMemo(() => {
    if (isLoading || typeof data === 'undefined') {
      return undefined;
    }

    return data.ytelser
      .flatMap(({ lovKildeToRegistreringshjemler }) =>
        lovKildeToRegistreringshjemler.flatMap(({ registreringshjemler }) =>
          registreringshjemler.map<[string, string]>(({ id, navn }) => [id, navn])
        )
      )
      .reduce<Hjemler>((acc, [id, navn]) => ({ ...acc, [id]: navn }), {});
  }, [data, isLoading]);
};

export const useRegistreringshjemmelName = (hjemmelId?: string | null): string => {
  const registreringshjemler = useRegistreringshjemler();

  if (typeof hjemmelId !== 'string') {
    return 'Mangler';
  }

  return registreringshjemler?.[hjemmelId] ?? hjemmelId;
};
