import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useGetKvalitetsvurderingQuery } from '../redux-api/kaka-kvalitetsvurdering';
import { IKakaKvalitetsvurdering } from '../types/kaka-kvalitetsvurdering';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useKvalitetsvurdering = (): [IKakaKvalitetsvurdering | undefined, boolean] => {
  const { data: oppgavebehandling } = useOppgave();
  const { data, isLoading } = useGetKvalitetsvurderingQuery(oppgavebehandling?.kvalitetsvurderingId ?? skipToken);

  return [data, isLoading];
};
