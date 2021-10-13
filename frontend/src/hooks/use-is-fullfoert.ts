import { useMemo } from 'react';
import { useGetKlagebehandlingQuery } from '../redux-api/oppgave';

export const useIsFullfoert = (klagebehandlingId: string): boolean => {
  const { data } = useGetKlagebehandlingQuery(klagebehandlingId);

  return useMemo(() => {
    if (typeof data === 'undefined') {
      return false;
    }

    return data.isAvsluttetAvSaksbehandler;
  }, [data]);
};
