import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError, skipToken } from '@reduxjs/toolkit/query';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import {
  useGetKvalitetsvurderingQuery,
  useUpdateKvalitetsvurderingMutation,
} from '@app/redux-api/kaka-kvalitetsvurdering/v2';
import { IKvalitetsvurdering, IKvalitetsvurderingData } from '@app/types/kaka-kvalitetsvurdering/v2';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

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

export const useKvalitetsvurderingV2 = (): Loading | Loaded => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const param =
    typeof oppgave === 'undefined' || oppgave.kvalitetsvurderingReference === null
      ? skipToken
      : oppgave.kvalitetsvurderingReference.id;
  const { data: kvalitetsvurdering, isLoading: kvalitetsvurderingIsLoading } = useGetKvalitetsvurderingQuery(param);
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
