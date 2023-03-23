import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useGetKvalitetsvurderingQuery } from '@app/redux-api/kaka-kvalitetsvurdering/v1';
import { IKvalitetsvurderingV1 } from '@app/types/kaka-kvalitetsvurdering/v1';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useKvalitetsvurdering = (): [IKvalitetsvurderingV1 | undefined, boolean] => {
  const { data: oppgave } = useOppgave();
  const { data, isLoading } = useGetKvalitetsvurderingQuery(oppgave?.kvalitetsvurderingId ?? skipToken);

  return [data, isLoading];
};
