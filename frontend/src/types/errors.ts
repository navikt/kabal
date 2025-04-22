import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { isGenericObject } from './types';

export interface ApiError {
  type: string; // about:blank
  title: string; // Bad Request
  status: number; // 400
  detail: string; // Failed to read request
  instance: string; // /behandlinger/:id/mottattklageinstans
}

interface ApiDataError {
  data: ApiError;
}

export const isApiDataError = (error: unknown): error is ApiDataError =>
  isGenericObject(error) && 'data' in error && isApiError(error.data);

export const isApiError = (error: unknown): error is ApiError =>
  isGenericObject(error) &&
  'type' in error &&
  'title' in error &&
  'status' in error &&
  'instance' in error &&
  typeof error.type === 'string' &&
  typeof error.title === 'string' &&
  typeof error.status === 'number' &&
  typeof error.instance === 'string';

interface IApiRejectionError {
  error: FetchBaseQueryError;
  isUnhandledError: true;
  meta: unknown;
}

export const isApiRejectionError = (error: unknown): error is IApiRejectionError =>
  isGenericObject(error) &&
  'error' in error &&
  isGenericObject(error.error) &&
  'isUnhandledError' in error &&
  typeof error.isUnhandledError === 'boolean';
