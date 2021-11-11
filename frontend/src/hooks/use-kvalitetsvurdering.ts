import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useGetKvalitetsvurderingQuery } from '../redux-api/kaka-kvalitetsvurdering';
import { IKakaKvalitetsvurdering } from '../redux-api/kaka-kvalitetsvurdering-types';
import { useKlagebehandling } from './use-klagebehandling';

export const useKvalitetsvurdering = (): [IKakaKvalitetsvurdering | undefined, boolean] => {
  const [klagebehandling] = useKlagebehandling();
  const { data, isLoading } = useGetKvalitetsvurderingQuery(klagebehandling?.kvalitetsvurderingId ?? skipToken);

  return [data, isLoading];
};
