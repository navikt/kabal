interface InvalidProperty {
  field: string;
  reason: string;
}

export interface ApiError {
  title: string;
  status: number;
  detail: string;
  'invalid-properties': InvalidProperty[];
}

export interface WrappedApiError {
  data: ApiError;
  status: number;
}

export const isWrappedApiError = (err: unknown): err is WrappedApiError => {
  if (!isObject(err)) {
    return false;
  }

  if (typeof err.status !== 'number') {
    return false;
  }

  return isApiError(err.data);
};

export const isApiError = (err: unknown): err is ApiError => {
  if (!isObject(err)) {
    return false;
  }

  if (typeof err.title !== 'string') {
    return false;
  }

  if (typeof err.status !== 'number') {
    return false;
  }

  if (typeof err.detail !== 'string') {
    return false;
  }

  return true;
};

export const UNKNOWN_ERROR: ApiError = {
  title: 'Unknown error',
  status: 0,
  detail: 'Unknown error',
  'invalid-properties': [],
};

const isObject = (e: unknown): e is Record<string, unknown> => typeof e === 'object' && !Array.isArray(e);
