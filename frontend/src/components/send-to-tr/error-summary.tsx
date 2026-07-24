import { ErrorSummary } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';
import { type IReduxError, isReduxError } from '@/functions/error-type-guard';
import type { GenericObject } from '@/types/types';

interface Props {
  errors: IValidationSection[];
}

export const Errors = ({ errors }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errors.length !== 0) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [errors]);

  if (errors.length === 0) {
    return null;
  }

  return (
    <ErrorSummary ref={ref}>
      {errors.flatMap(({ properties }) =>
        properties.map(({ field, reason }) => (
          <ErrorSummary.Item key={field} href={`#${field}`}>
            {reason}
          </ErrorSummary.Item>
        )),
      )}
    </ErrorSummary>
  );
};

interface ValidationError {
  reason: string;
  field: string;
}

export interface IValidationSection extends GenericObject {
  section: 'behandling';
  properties: ValidationError[];
}

export interface IApiValidationResponse {
  status: number;
  title: string;
  sections: IValidationSection[];
}

export const isReduxValidationResponse = (error: unknown): error is IReduxError<IApiValidationResponse> => {
  if (!isReduxError<IApiValidationResponse>(error)) {
    return false;
  }

  const { data } = error;

  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return Array.isArray(data.sections) && data.sections.every(isValidationSection);
};

const isValidationSection = (error: GenericObject): error is IValidationSection =>
  typeof error.section === 'string' && Array.isArray(error.properties);
