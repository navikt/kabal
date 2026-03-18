import { SpanStatusCode } from '@opentelemetry/api';
import { type FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { ENVIRONMENT } from '@/environment';
import { queryStringify } from '@/functions/query-string';
import { setHeaders } from '@/headers';
import { tracer } from '@/tracing/tracer';

const classifyNetworkError = (error: unknown): string => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'abort';
  }

  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();

    if (message.includes('failed to fetch') || message.includes('network')) {
      return 'network';
    }

    if (message.includes('cors')) {
      return 'cors';
    }

    return 'type-error';
  }

  return 'unknown';
};

const mode: RequestMode | undefined = ENVIRONMENT.isLocal ? 'cors' : undefined;

export const staggeredBaseQuery = (baseUrl: string) => {
  const fetch = fetchBaseQuery({
    baseUrl,
    mode,
    credentials: 'include',
    paramsSerializer: queryStringify,
    prepareHeaders: setHeaders,
  });

  const retryingFetch = retry(
    async (args: string | FetchArgs, api, extraOptions) => {
      const result = await fetch(args, api, extraOptions);

      if (typeof result.error === 'undefined') {
        return result;
      }

      const status = result.meta?.response?.status;

      if (status === undefined) {
        retry.fail(result.error, result.meta);
      }

      if (status === 401) {
        if (!ENVIRONMENT.isLocal) {
          window.location.assign('/oauth2/login');
        }

        retry.fail(result.error, result.meta);
      }

      if (status >= 400 && status < 500) {
        retry.fail(result.error, result.meta);
      }

      return result;
    },
    {
      maxRetries: 2,
      backoff: (attempt) => new Promise((resolve) => setTimeout(resolve, 1000 * attempt)),
    },
  );

  const instrumented: typeof retryingFetch = (args, api, extraOptions) => {
    return tracer.startActiveSpan(`rtk_query.${api.endpoint}`, async (span) => {
      span.setAttribute('type', api.type);

      try {
        try {
          const result = await retryingFetch(args, api, extraOptions);

          if (result.error !== undefined) {
            const status = result.meta?.response?.status;
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: `RTK Query error: ${status?.toString(10) ?? 'unknown'}`,
            });
          }
          return result;
        } catch (error) {
          const category = classifyNetworkError(error);
          span.setAttribute('error.category', category);
          span.setStatus({ code: SpanStatusCode.ERROR, message: `RTK Query request failed: ${category}` });
          if (error instanceof Error) {
            span.recordException(error);
          }
          throw error;
        }
      } finally {
        span.end();
      }
    });
  };

  return instrumented;
};

export const PROXY_BASE_QUERY = staggeredBaseQuery('');

const API_PATH = '/api';
export const API_BASE_QUERY = staggeredBaseQuery(API_PATH);

export const KABAL_API_BASE_PATH = '/api/kabal-api';
export const KABAL_BEHANDLINGER_BASE_PATH = `${KABAL_API_BASE_PATH}/behandlinger`;
export const INNSTILLINGER_BASE_PATH = '/api/kabal-innstillinger';

export const KABAL_BEHANDLINGER_BASE_QUERY = staggeredBaseQuery(KABAL_BEHANDLINGER_BASE_PATH);
export const KABAL_INTERNAL_BASE_QUERY = staggeredBaseQuery('/api');
export const INNSTILLINGER_BASE_QUERY = staggeredBaseQuery(INNSTILLINGER_BASE_PATH);
export const KAKA_KVALITETSVURDERING_BASE_QUERY = staggeredBaseQuery('/api/kaka-api/kvalitetsvurderinger');
export const KABAL_TEXT_TEMPLATES_BASE_QUERY = staggeredBaseQuery('/api/kabal-text-templates');
export const KABAL_API_BASE_QUERY = staggeredBaseQuery(KABAL_API_BASE_PATH);
