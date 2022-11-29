import { FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { apiErrorToast } from '../components/toast/toast-content/fetch-error-toast';

export const IS_LOCALHOST = window.location.hostname === 'localhost';

const mode: RequestMode | undefined = IS_LOCALHOST ? 'cors' : undefined;

const staggeredBaseQuery = (baseUrl: string) => {
  const fetch = fetchBaseQuery({
    baseUrl,
    mode,
    credentials: 'include',
  });

  return retry(
    async (args: string | FetchArgs, api, extraOptions) => {
      const result = await fetch(args, api, extraOptions);

      if (typeof result.error === 'undefined') {
        return result;
      }

      apiErrorToast(result.error, args);

      if (result.error.status === 401) {
        if (!IS_LOCALHOST) {
          window.location.assign('/oauth2/login');
        }

        retry.fail(result.error);
      }

      if (
        result.error.status === 400 ||
        result.error.status === 403 ||
        result.error.status === 404 ||
        result.error.status === 405
      ) {
        retry.fail(result.error);
      }

      return result;
    },
    { maxRetries: 3 }
  );
};

const API_PATH = '/api';
export const API_BASE_QUERY = staggeredBaseQuery(API_PATH);

export const KABAL_OPPGAVEBEHANDLING_PATH = '/api/kabal-api/klagebehandlinger';
export const KABAL_BEHANDLINGER_BASE_PATH = '/api/kabal-api/behandlinger';
export const KODEVERK_BASE_PATH = '/api/klage-kodeverk-api';
export const INNSTILLINGER_BASE_PATH = '/api/kabal-innstillinger';

export const KABAL_BEHANDLINGER_BASE_QUERY = staggeredBaseQuery(KABAL_BEHANDLINGER_BASE_PATH);
export const KABAL_INTERNAL_BASE_QUERY = staggeredBaseQuery('/api');
export const KABAL_OPPGAVEBEHANDLING_BASE_QUERY = staggeredBaseQuery(KABAL_OPPGAVEBEHANDLING_PATH);
export const INNSTILLINGER_BASE_QUERY = staggeredBaseQuery(INNSTILLINGER_BASE_PATH);
export const KAKA_KVALITETSVURDERING_BASE_QUERY = staggeredBaseQuery('/api/kaka-api/kvalitetsvurdering');
export const FEATURE_TOGGLE_BASE_QUERY = staggeredBaseQuery('/api/kabal-api/featuretoggle');
export const KABAL_TEXT_TEMPLATES_BASE_QUERY = staggeredBaseQuery('/api/kabal-text-templates');
