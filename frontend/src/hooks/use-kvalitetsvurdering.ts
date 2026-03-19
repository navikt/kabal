import { skipToken } from '@reduxjs/toolkit/query';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useGetKvalitetsvurderingQuery } from '@/redux-api/kaka-kvalitetsvurdering/v1';
import type { IKvalitetsvurderingV1 } from '@/types/kaka-kvalitetsvurdering/v1';

export const useKvalitetsvurdering = (): [IKvalitetsvurderingV1 | undefined, boolean] => {
  const { data: oppgave } = useOppgave();
  const { data, isLoading } = useGetKvalitetsvurderingQuery(oppgave?.kvalitetsvurderingReference?.id ?? skipToken);

  return [data, isLoading];
};
