import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ErrorOrNotRelevantState, LoadedState, LoadingState } from '@/components/kvalitetsvurdering/common/types';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurderingV3 } from '@/hooks/use-kvalitetsvurdering';
import { useUpdateKvalitetsvurderingMutation } from '@/redux-api/kaka-kvalitetsvurdering/v3';
import type { IKvalitetsvurdering, KvalitetsvurderingDataV3 } from '@/types/kaka-kvalitetsvurdering/v3';

interface UpdateStatus {
  isLoading: boolean;
  isSuccess: boolean;
  isUninitialized: boolean;
  isError: boolean;
  error?: FetchBaseQueryError | SerializedError;
}

interface Loading extends LoadingState {
  updateStatus: UpdateStatus;
}

interface Loaded extends LoadedState<IKvalitetsvurdering, KvalitetsvurderingDataV3> {
  updateStatus: UpdateStatus;
}

interface Error extends ErrorOrNotRelevantState {
  updateStatus: undefined;
}

const EMPTY_ARRAY: string[] = [];

export const useKvalitetsvurderingV3State = (): Loading | Loaded | Error => {
  const { data: oppgave, isSuccess: oppgaveIsSuccess, isLoading: oppgaveIsLoading } = useOppgave();
  const { data: kvalitetsvurdering, isSuccess: kvIsSuccess, isLoading: kvIsLoading } = useKvalitetsvurderingV3();
  const [update, updateStatus] = useUpdateKvalitetsvurderingMutation();

  const id = oppgave?.kvalitetsvurderingReference?.id;

  if (oppgaveIsSuccess && kvIsSuccess && typeof id === 'string') {
    return {
      oppgave,
      hjemler: oppgave.resultat.hjemmelIdSet,
      kvalitetsvurdering,
      update: (patch) => update({ ...patch, id }).unwrap(),
      isLoading: false,
      isSuccess: true,
      updateStatus,
    };
  }

  if (oppgaveIsLoading || kvIsLoading) {
    return {
      oppgave: undefined,
      hjemler: EMPTY_ARRAY,
      kvalitetsvurdering: undefined,
      update: undefined,
      isLoading: true,
      isSuccess: false,
      updateStatus,
    };
  }

  return {
    oppgave: undefined,
    hjemler: EMPTY_ARRAY,
    kvalitetsvurdering: undefined,
    update: undefined,
    isLoading: false,
    isSuccess: false,
    updateStatus: undefined,
  };
};
