interface ApiError {
  type: string; // about:blank
  title: string; // Bad Request
  status: number; // 400
  detail: string; // Failed to reqd request
  instance: string; // /behandlinger/:id/mottattklageinstans
}

export const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' &&
  error !== null &&
  typeof error['status'] === 'number' &&
  typeof error['detail'] === 'string';
