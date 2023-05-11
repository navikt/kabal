import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import {
  useGetKvalitetsvurderingQuery,
  useUpdateKvalitetsvurderingMutation,
} from '@app/redux-api/kaka-kvalitetsvurdering/v2';
import { IKvalitetsvurdering, IKvalitetsvurderingData } from '@app/types/kaka-kvalitetsvurdering/v2';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

interface Loading {
  oppgave: undefined;
  hjemler: string[];
  kvalitetsvurdering: undefined;
  update: undefined;
  isLoading: true;
  isUpdating: false;
}

interface Loaded {
  oppgave: IOppgavebehandling;
  hjemler: string[];
  kvalitetsvurdering: IKvalitetsvurdering;
  update: (patch: Partial<IKvalitetsvurderingData>) => Promise<IKvalitetsvurdering>;
  isLoading: false;
  isUpdating: boolean;
}

const EMPTY_ARRAY: string[] = [];

export const useKvalitetsvurderingV2 = (): Loading | Loaded => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const param = typeof oppgave === 'undefined' ? skipToken : oppgave.kvalitetsvurderingReference.id;
  const { data: kvalitetsvurdering, isLoading: kvalitetsvurderingIsLoading } = useGetKvalitetsvurderingQuery(param);
  const [update, { isLoading: updateIsLoading }] = useUpdateKvalitetsvurderingMutation();

  if (
    oppgaveIsLoading ||
    kvalitetsvurderingIsLoading ||
    typeof oppgave === 'undefined' ||
    typeof kvalitetsvurdering === 'undefined'
  ) {
    return {
      oppgave: undefined,
      hjemler: EMPTY_ARRAY,
      kvalitetsvurdering: undefined,
      update: undefined,
      isLoading: true,
      isUpdating: false,
    };
  }

  return {
    oppgave,
    hjemler: oppgave.resultat.hjemler,
    kvalitetsvurdering,
    update: (patch) => update({ ...patch, id: oppgave.kvalitetsvurderingReference.id }).unwrap(),
    isLoading: false,
    isUpdating: updateIsLoading,
  };
};