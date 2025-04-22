import { isApiDataError } from '@app/types/errors';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

export interface ErrorMessage {
  title: string;
  detail?: string;
  status?: number | string;
}

export const getErrorData = (error: FetchBaseQueryError | SerializedError | undefined): ErrorMessage => {
  if (typeof error === 'undefined') {
    return { title: 'Ukjent feil' };
  }

  if (!('status' in error)) {
    return { title: error.name ?? 'Ukjent feil', detail: error.message };
  }

  if (typeof error.status === 'number') {
    if (typeof error.data === 'string') {
      return { title: error.data, status: error.status };
    }
    if (isApiDataError(error)) {
      return error.data;
    }
  }

  if (error.status === 'PARSING_ERROR') {
    return { title: error.error, status: error.status, detail: error.data };
  }

  if (error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR') {
    return { title: error.error, status: error.status };
  }

  if (error.status === 'CUSTOM_ERROR') {
    return { title: error.error, status: error.status, detail: getCustomErrorMessage(error.data) };
  }

  return { title: 'Ukjent feil' };
};

const getCustomErrorMessage = (data?: unknown): string | undefined => {
  if (typeof data === 'string') {
    return data;
  }
  if (typeof data === 'number') {
    return data.toString();
  }
  if (typeof data === 'object') {
    return JSON.stringify(data);
  }

  return undefined;
};
