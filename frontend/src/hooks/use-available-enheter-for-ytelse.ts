import { useMemo } from 'react';
import { IEnhet, useGetBrukerQuery } from '../redux-api/bruker';

export const useAvailableEnheterForYtelse = (ytelseId: string): IEnhet[] => {
  const { data: userData } = useGetBrukerQuery();

  return useMemo(() => {
    if (typeof userData === 'undefined' || userData.enheter.length === 0) {
      return [];
    }

    return userData.enheter.filter((enhet) => enhet.lovligeYtelser.includes(ytelseId));
  }, [ytelseId, userData]);
};
