import { useContext } from 'react';
import { ValidationErrorContext } from '../components/kvalitetsvurdering/validation-error-context';
import { IValidationErrors } from '../functions/error-type-guard';
import { IKakaKvalitetsvurdering } from '../redux-api/kaka-kvalitetsvurdering-types';

type Field = keyof IKakaKvalitetsvurdering | 'vedtaksdokument' | 'utfall' | 'hjemmel';

export const useValidationError = (field: Field): string | undefined => {
  const context = useContext(ValidationErrorContext);

  return context?.validationErrors.find((e) => e.field === field)?.reason;
};

export const useAllValidationErrors = (): IValidationErrors => {
  const context = useContext(ValidationErrorContext);

  return context?.validationErrors ?? [];
};
