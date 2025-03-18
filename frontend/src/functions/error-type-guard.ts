import type { DEFAULT_FIELD_NAMES } from '@app/types/field-names';
import { type GenericObject, isGenericObject } from './../types/types';

export interface IValidationError {
  reason: string;
  field: keyof typeof DEFAULT_FIELD_NAMES;
}

export enum SECTION_KEY {
  BEHANDLING = 'behandling',
  KVALITETSVURDERING = 'kvalitetsvurdering',
  DOKUMENTER = 'dokumenter',
  FORLENGET_BEHANDLINGSTID_DRAFT = 'forlengetBehandlingstidDraft',
}

export interface IValidationSection extends GenericObject {
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

const isValidationSection = (error: GenericObject): error is IValidationSection =>
  typeof error.section === 'string' && Array.isArray(error.properties);

interface IReduxError<T = unknown> {
  status: number;
  data: T;
}

const isReduxError = <T>(error: unknown): error is IReduxError<T> =>
  isGenericObject(error) && typeof error.status === 'number';
