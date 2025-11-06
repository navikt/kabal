import type { FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { isGenericObject } from './types';

export interface KabalApiErrorData {
  type: string; // about:blank
  title: string; // Bad Request
  status: number; // 400
  detail?: string; // Failed to read request
}

interface ApiDataError {
  data: KabalApiErrorData;
}

export const isApiDataError = (error: unknown): error is ApiDataError =>
  isGenericObject(error) && 'data' in error && isKabalApiErrorData(error.data);

export const isKabalApiErrorData = (data: unknown): data is KabalApiErrorData =>
  isGenericObject(data) &&
  'type' in data &&
  'title' in data &&
  'status' in data &&
  typeof data.type === 'string' &&
  typeof data.title === 'string' &&
  typeof data.status === 'number';

export interface ApiRejectionError {
  error: FetchBaseQueryError;
  isUnhandledError: true;
  meta: FetchBaseQueryMeta;
}

export const isApiRejectionError = (error: unknown): error is ApiRejectionError =>
  isGenericObject(error) &&
  'error' in error &&
  isGenericObject(error.error) &&
  'isUnhandledError' in error &&
  typeof error.isUnhandledError === 'boolean';
