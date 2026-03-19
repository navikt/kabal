import { useContext, useMemo } from 'react';
import type { GroupErrorField } from '@/components/kvalitetsvurdering/v3/common/types';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import type { KvalitetsvurderingDataV3 } from '@/types/kaka-kvalitetsvurdering/v3';

type Field = keyof KvalitetsvurderingDataV3 | GroupErrorField;

export const useValidationError = (field?: Field): string | undefined => {
  const context = useContext(ValidationErrorContext);

  return useMemo(() => {
    if (typeof field === 'undefined') {
      return undefined;
    }

    return context?.validationSectionErrors?.flatMap((e) => e.properties)?.find((p) => p.field === field)?.reason;
  }, [context, field]);
};
