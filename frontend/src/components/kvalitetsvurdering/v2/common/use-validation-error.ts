import type { KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES } from '@app/components/kvalitetsvurdering/v2/common/use-field-name';
import { ValidationErrorContext } from '@app/components/kvalitetsvurdering/validation-error-context';
import type { IKvalitetsvurderingData } from '@app/types/kaka-kvalitetsvurdering/v2';
import { useContext, useMemo } from 'react';

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
