import { FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

const IS_LOCALHOST = window.location.hostname === 'localhost';
export const DOMAIN = IS_LOCALHOST ? 'https://kabal.dev.nav.no' : '';

const mode: RequestMode | undefined = IS_LOCALHOST ? 'cors' : undefined;

const staggeredBaseQuery = (baseUrl: string) =>
  retry(
    async (args: string | FetchArgs, api, extraOptions) => {
      const result = await fetchBaseQuery({
        baseUrl: `${DOMAIN}${baseUrl}`,
        mode,
        credentials: 'include',
      })(args, api, extraOptions);

      if (typeof result.error === 'undefined') {
        return result;
      }

      const { status } = result.error;

      if (status === 401) {
        if (!IS_LOCALHOST) {
          window.location.reload();
        }

        retry.fail(result.error);
      }

      if (status === 400 || status === 403 || status === 404) {
        retry.fail(result.error);
      }

      return result;
    },
    {
      maxRetries: 3,
    }
  );

export const KABAL_OPPGAVEBEHANDLING_PATH = '/api/kabal-api/klagebehandlinger';

export const KABAL_INTERNAL_BASE_QUERY = staggeredBaseQuery('/api/kabal-api/internal');
export const KABAL_OPPGAVEBEHANDLING_BASE_QUERY = staggeredBaseQuery(KABAL_OPPGAVEBEHANDLING_PATH);
export const KABAL_ANSATTE_BASE_QUERY = staggeredBaseQuery('/api/kabal-api/ansatte');
export const SEARCH_BASE_QUERY = staggeredBaseQuery('/api/kabal-search');
export const INNSTILLINGER_BASE_QUERY = staggeredBaseQuery('/api/kabal-innstillinger');
export const EDITOR_BASE_QUERY = staggeredBaseQuery('/api/kabal-smart-editor-api');
export const KODEVERK_BASE_QUERY = staggeredBaseQuery('/api/klage-kodeverk-api');
export const KAKA_KVALITETSVURDERING_BASE_QUERY = staggeredBaseQuery('/api/kaka-api/kvalitetsvurdering');
export const FEATURE_TOGGLE_BASE_QUERY = staggeredBaseQuery('/api/kabal-api/featuretoggle');
