import { useContext, useMemo } from 'react';
import type { OmgjøringErrorFields } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import type { ErrorOrNotRelevantState, LoadedState, LoadingState } from '@/components/kvalitetsvurdering/common/types';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurderingAnkeITRAfter2027 } from '@/hooks/use-kvalitetsvurdering';
import { useUpdateKvalitetsvurderingMutation } from '@/redux-api/kaka-kvalitetsvurdering/anke-i-tr-after-2027';
import type {
  IKvalitetsvurderingAnkeITRAfter2027,
  KvalitetsvurderingDataAnkeITRAfter2027,
} from '@/types/kaka-kvalitetsvurdering/anke-i-tr-after-2027';

type Loaded = LoadedState<IKvalitetsvurderingAnkeITRAfter2027, KvalitetsvurderingDataAnkeITRAfter2027>;

export const useKvalitetsvurderingAnkeITRAfter2027State = (): LoadingState | Loaded | ErrorOrNotRelevantState => {
  const { data: oppgave, isSuccess: oppgaveIsSuccess, isLoading: oppgaveIsLoading } = useOppgave();
  const {
    data: kvalitetsvurdering,
    isSuccess: kvIsSuccess,
    isLoading: kvIsLoading,
  } = useKvalitetsvurderingAnkeITRAfter2027();
  const [update] = useUpdateKvalitetsvurderingMutation();

  const id = oppgave?.kvalitetsvurderingReference?.id;

  if (oppgaveIsSuccess && kvIsSuccess && typeof id === 'string') {
    return {
      oppgave,
      hjemler: oppgave.resultat.hjemmelIdSet,
      kvalitetsvurdering,
      update: (patch) => update({ ...patch, id }).unwrap(),
      isLoading: false,
      isSuccess: true,
    };
  }

  if (oppgaveIsLoading || kvIsLoading) {
    return {
      oppgave: undefined,
      hjemler: [],
      kvalitetsvurdering: undefined,
      update: undefined,
      isLoading: true,
      isSuccess: false,
    };
  }

  return {
    oppgave: undefined,
    hjemler: [],
    kvalitetsvurdering: undefined,
    update: undefined,
    isLoading: false,
    isSuccess: false,
  };
};

type ValidationField = keyof KvalitetsvurderingDataAnkeITRAfter2027 | OmgjøringErrorFields;

export const useValidationError = (field: ValidationField): string | undefined => {
  const context = useContext(ValidationErrorContext);

  return useMemo(
    () => context.validationSectionErrors.flatMap((e) => e.properties).find((p) => p.field === field)?.reason,
    [context, field],
  );
};
