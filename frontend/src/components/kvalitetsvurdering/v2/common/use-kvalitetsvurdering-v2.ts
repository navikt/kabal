import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurderingV2 } from '@/hooks/use-kvalitetsvurdering';
import { useUpdateKvalitetsvurderingMutation } from '@/redux-api/kaka-kvalitetsvurdering/v2';
import type { IKvalitetsvurdering, IKvalitetsvurderingData } from '@/types/kaka-kvalitetsvurdering/v2';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

interface UpdateStatus {
  isLoading: boolean;
  isSuccess: boolean;
  isUninitialized: boolean;
  isError: boolean;
  error?: FetchBaseQueryError | SerializedError;
}

interface Loading {
  oppgave: undefined;
  hjemler: string[];
  kvalitetsvurdering: undefined;
  update: undefined;
  isLoading: true;
  updateStatus: UpdateStatus;
}

interface Loaded {
  oppgave: IOppgavebehandling;
  hjemler: string[];
  kvalitetsvurdering: IKvalitetsvurdering;
  update: (patch: Partial<IKvalitetsvurderingData>) => Promise<IKvalitetsvurdering>;
  isLoading: false;
  updateStatus: UpdateStatus;
}

const EMPTY_ARRAY: string[] = [];

export const useKvalitetsvurderingV2State = (): Loading | Loaded => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const [kvalitetsvurdering, kvalitetsvurderingIsLoading] = useKvalitetsvurderingV2();
  const [update, updateStatus] = useUpdateKvalitetsvurderingMutation();

  const id = oppgave?.kvalitetsvurderingReference?.id;

  if (
    oppgaveIsLoading ||
    kvalitetsvurderingIsLoading ||
    typeof oppgave === 'undefined' ||
    typeof kvalitetsvurdering === 'undefined' ||
    typeof id !== 'string'
  ) {
    return {
      oppgave: undefined,
      hjemler: EMPTY_ARRAY,
      kvalitetsvurdering: undefined,
      update: undefined,
      isLoading: true,
      updateStatus,
    };
  }

  return {
    oppgave,
    hjemler: oppgave.resultat.hjemmelIdSet,
    kvalitetsvurdering,
    update: (patch) => update({ ...patch, id }).unwrap(),
    isLoading: false,
    updateStatus,
  };
};
