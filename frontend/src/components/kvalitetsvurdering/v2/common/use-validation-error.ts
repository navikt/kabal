import { useContext, useMemo } from 'react';
import { IKvalitetsvurderingData } from '../../../../types/kaka-kvalitetsvurdering/v2';
import { ValidationErrorContext } from '../../validation-error-context';
import { KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES } from './use-field-name';

type Field = keyof IKvalitetsvurderingData | keyof typeof KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES;

export const useValidationError = (field?: Field): string | undefined => {
  const context = useContext(ValidationErrorContext);

  return useMemo(() => {
    if (typeof field === 'undefined') {
      return undefined;
    }

    return context?.validationSectionErrors?.flatMap((e) => e.properties)?.find((p) => p.field === field)?.reason;
  }, [context, field]);
};
