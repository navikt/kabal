import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface IFetchSendError {
  status: number;
  data: ISendError;
}

interface ISendError {
  type: string;
  title: string;
  status: number;
  instance: string;
  sections: ISection[];
}

interface ISection {
  section: string;
  properties: IErrorProperty[];
}

export interface IErrorProperty {
  field: string;
  reason: string;
}

export const isSendError = (error: FetchBaseQueryError | SerializedError | undefined): error is IFetchSendError => {
  if (error === undefined) {
    return false;
  }

  return (
    'status' in error &&
    typeof error.status !== 'string' &&
    'sections' in error &&
    Array.isArray(error.sections) &&
    error.sections.every(isSection)
  );
};

const isSection = (section: unknown): section is ISection => {
  if (typeof section !== 'object' || section === null) {
    return false;
  }

  return (
    'section' in section &&
    typeof section.section === 'string' &&
    'properties' in section &&
    Array.isArray(section.properties) &&
    section.properties.every(isProperty)
  );
};

const isProperty = (property: unknown): property is IErrorProperty => {
  if (typeof property !== 'object' || property === null) {
    return false;
  }

  return (
    'field' in property &&
    typeof property.field === 'string' &&
    'reason' in property &&
    typeof property.reason === 'string'
  );
};
