import { useContext, useMemo } from 'react';
import type {
  ValidationField as AnkeValidationField,
  OmgjøringErrorFields,
} from '@/components/kvalitetsvurdering/anke-after-2027/data';
import type { ErrorOrNotRelevantState, LoadedState, LoadingState } from '@/components/kvalitetsvurdering/common/types';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurderingAnkeAfter2027 } from '@/hooks/use-kvalitetsvurdering';
import { useUpdateKvalitetsvurderingMutation } from '@/redux-api/kvalitetsvurdering/anke-after-2027';
import type {
  IKvalitetsvurderingAnkeAfter2027,
  KvalitetsvurderingDataAnkeAfter2027,
} from '@/types/kvalitetsvurdering/anke-after-2027';
import { isKantKvalitetsvurdering } from '@/types/kvalitetsvurdering/common';

type Loaded = LoadedState<IKvalitetsvurderingAnkeAfter2027, KvalitetsvurderingDataAnkeAfter2027>;

export const useKvalitetsvurderingAnkeAfter2027State = (): LoadingState | Loaded | ErrorOrNotRelevantState => {
  const { data: oppgave, isSuccess: oppgaveIsSuccess, isLoading: oppgaveIsLoading } = useOppgave();
  const {
    data: kvalitetsvurdering,
    isSuccess: kvIsSuccess,
    isLoading: kvIsLoading,
  } = useKvalitetsvurderingAnkeAfter2027();
  const [update] = useUpdateKvalitetsvurderingMutation();

  if (oppgaveIsSuccess && isKantKvalitetsvurdering(oppgave) && kvIsSuccess) {
    return {
      oppgave,
      hjemler: oppgave.resultat.hjemmelIdSet,
      kvalitetsvurdering,
      update: (patch) => {
        const { created, modified, ...current } = kvalitetsvurdering;

        return update({ ...current, ...patch, id: oppgave.kantReference }).unwrap();
      },
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

type ValidationField = keyof KvalitetsvurderingDataAnkeAfter2027 | OmgjøringErrorFields | AnkeValidationField;

export const useValidationError = (field: ValidationField): string | undefined => {
  const context = useContext(ValidationErrorContext);

  return useMemo(
    () => context.validationSectionErrors.flatMap((e) => e.properties).find((p) => p.field === field)?.reason,
    [context, field],
  );
};
