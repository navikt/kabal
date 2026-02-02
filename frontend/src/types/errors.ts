import type { FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { isGenericObject } from './types';

export interface KabalApiErrorData {
  title: string; // Bad Request
  status: number; // 400
  detail?: string; // Failed to read request
}

export interface BFFError {
  statusCode: number;
  error: string;
  message: string;
  code?: string;
}

export const isBFFError = (data: unknown): data is BFFError =>
  isGenericObject(data) &&
  'statusCode' in data &&
  'error' in data &&
  'message' in data &&
  typeof data.statusCode === 'number' &&
  typeof data.error === 'string' &&
  typeof data.message === 'string';

interface ApiDataError {
  data: KabalApiErrorData;
}

export const isApiDataError = (error: unknown): error is ApiDataError =>
  isGenericObject(error) && 'data' in error && isKabalApiErrorData(error.data);

export const isKabalApiErrorData = (data: unknown): data is KabalApiErrorData =>
  isGenericObject(data) &&
  'title' in data &&
  'status' in data &&
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
