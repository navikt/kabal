import { useContext, useMemo } from 'react';
import { ValidationErrorContext } from '../components/kvalitetsvurdering/validation-error-context';
import { IValidationSection } from '../functions/error-type-guard';
import { IKakaKvalitetsvurdering } from '../redux-api/kaka-kvalitetsvurdering-types';

type Field = keyof IKakaKvalitetsvurdering | 'vedtaksdokument' | 'utfall' | 'hjemmel';

export const useValidationError = (field: Field): string | undefined => {
  const context = useContext(ValidationErrorContext);

  const allProperties = useMemo(
    () => context?.validationSectionErrors?.flatMap(({ properties }) => properties),
    [context]
  );
  return useMemo(() => allProperties?.find((p) => p.field === field)?.reason, [allProperties, field]);
};

export const useAllValidationErrors = (): IValidationSection[] => {
  const context = useContext(ValidationErrorContext);

  return context?.validationSectionErrors ?? [];
};
