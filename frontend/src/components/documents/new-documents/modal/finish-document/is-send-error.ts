import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

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

  return 'status' in error && typeof error.status !== 'string';
};
