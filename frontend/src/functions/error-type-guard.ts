import { FIELD_NAMES } from '../hooks/use-field-name';

export interface IValidationError {
  reason: string;
  field: keyof typeof FIELD_NAMES;
}

export enum SECTION_KEY {
  BEHANDLING = 'behandling',
  KVALITETSVURDERING = 'kvalitetsvurdering',
  DOKUMENTER = 'dokumenter',
}

export interface IValidationSection {
  section: SECTION_KEY;
  properties: IValidationError[];
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

const isValidationSection = (error: unknown): error is IValidationSection =>
  typeof error === 'object' &&
  error !== null &&
  typeof error['section'] === 'string' &&
  Array.isArray(error['properties']);

interface IReduxError<T = unknown> {
  status: number;
  data: T;
}

const isReduxError = <T>(error: unknown): error is IReduxError<T> =>
  typeof error === 'object' && error !== null && typeof error['status'] === 'number';
