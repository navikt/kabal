import { useGetKvalitetsvurderingQuery } from '@app/redux-api/kaka-kvalitetsvurdering/v1';
import type { IKvalitetsvurderingV1 } from '@app/types/kaka-kvalitetsvurdering/v1';
import { skipToken } from '@reduxjs/toolkit/query';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useKvalitetsvurdering = (): [IKvalitetsvurderingV1 | undefined, boolean] => {
  const { data: oppgave } = useOppgave();
  const { data, isLoading } = useGetKvalitetsvurderingQuery(oppgave?.kvalitetsvurderingReference?.id ?? skipToken);

  return [data, isLoading];
};
