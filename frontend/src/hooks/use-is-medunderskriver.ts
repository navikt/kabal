import { useMemo } from 'react';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { useGetKlagebehandlingQuery, useGetMedunderskriverQuery } from '../redux-api/oppgave';
import { useKlagebehandlingId } from './use-klagebehandling-id';

export const useIsMedunderskriver = () => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);
  const { data: userData, isLoading } = useGetBrukerQuery();

  return useMemo(() => {
    if (typeof klagebehandling === 'undefined' || isLoading || typeof userData === 'undefined') {
      return false;
    }

    return klagebehandling.medunderskriver?.navIdent === userData.info.navIdent;
  }, [klagebehandling, userData, isLoading]);
};

export const useCheckIsMedunderskriver = () => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: userData, isLoading } = useGetBrukerQuery();
  const { data: medunderskriver } = useGetMedunderskriverQuery(klagebehandlingId);

  return useMemo(() => {
    if (isLoading || typeof userData === 'undefined') {
      return false;
    }

    return medunderskriver?.medunderskriver?.navIdent === userData.info.navIdent;
  }, [medunderskriver?.medunderskriver?.navIdent, userData, isLoading]);
};
