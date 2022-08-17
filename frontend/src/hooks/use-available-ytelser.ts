import { useMemo } from 'react';
import { isNotUndefined } from '../functions/is-not-type-guards';
import { useUser } from '../simple-api-state/use-user';
import { IYtelse } from '../types/kodeverk';
import { useKodeverkValue } from './use-kodeverk-value';

export const useAvailableYtelser = (): IYtelse[] => {
  const ytelser = useKodeverkValue('ytelser');
  const { data: userData } = useUser();

  return useMemo<IYtelse[]>(() => {
    if (typeof userData === 'undefined' || typeof ytelser === 'undefined') {
      return [];
    }

    const ytelseSet: Set<string> = new Set(userData.enheter.flatMap(({ lovligeYtelser }) => lovligeYtelser));
    return Array.from(ytelseSet, (ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
  }, [userData, ytelser]);
};
