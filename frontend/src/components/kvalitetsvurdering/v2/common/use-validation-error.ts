import { useContext, useMemo } from 'react';
import { IKvalitetsvurderingData } from '../../../../types/kaka-kvalitetsvurdering/v2';
import { ValidationErrorContext } from '../../validation-error-context';
import { KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES } from './use-field-name';

type Field = keyof IKvalitetsvurderingData | keyof typeof KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES;

export const useValidationError = (field: Field): string | undefined => {
  const context = useContext(ValidationErrorContext);

  const allProperties = useMemo(
    () => context?.validationSectionErrors?.flatMap(({ properties }) => properties),
    [context]
  );

  return useMemo(() => allProperties?.find((p) => p.field === field)?.reason, [allProperties, field]);
};
