import { useMemo } from 'react';
import { useUser } from '../simple-api-state/use-user';
import { IEnhet } from '../types/bruker';

export const useAvailableEnheterForYtelse = (ytelseId: string): IEnhet[] => {
  const { data: userData } = useUser();

  return useMemo(() => {
    if (typeof userData === 'undefined' || userData.enheter.length === 0) {
      return [];
    }

    return userData.enheter.filter((enhet) => enhet.lovligeYtelser.includes(ytelseId));
  }, [ytelseId, userData]);
};
