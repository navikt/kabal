import { useMemo } from 'react';
import { isNotUndefined } from '../functions/is-not-type-guards';
import { useLatestYtelser } from '../simple-api-state/use-kodeverk';
import { useUser } from '../simple-api-state/use-user';
import { IYtelse } from '../types/kodeverk';

export const useAvailableYtelser = (): IYtelse[] => {
  const { data: ytelser } = useLatestYtelser();
  const { data: userData } = useUser();

  return useMemo<IYtelse[]>(() => {
    if (typeof userData === 'undefined' || typeof ytelser === 'undefined') {
      return [];
    }

    return userData.tildelteYtelser.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
  }, [userData, ytelser]);
};

export const useAvailableYtelserForEnhet = (): IYtelse[] => {
  const { data: ytelser } = useLatestYtelser();
  const { data: userData } = useUser();

  return useMemo<IYtelse[]>(() => {
    if (typeof userData === 'undefined' || typeof ytelser === 'undefined') {
      return [];
    }

    return userData.ansattEnhet.lovligeYtelser
      .map((ytelseId) => ytelser.find(({ id }) => id === ytelseId))
      .filter(isNotUndefined);
  }, [userData, ytelser]);
};
