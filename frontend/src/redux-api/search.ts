import { KABAL_API_BASE_QUERY } from '@app/redux-api/common';
import type { IPart } from '@app/types/oppgave-common';
import type { Enhet } from '@app/types/oppgavebehandling/oppgavebehandling';
import { createApi } from '@reduxjs/toolkit/query/react';

interface SearchPartWithUtsendingskanalParams {
  identifikator: string;
  sakenGjelderId: string;
  ytelseId: string;
}

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    searchpartwithutsendingskanal: builder.query<IPart, SearchPartWithUtsendingskanalParams>({
      query: (body) => ({ url: '/searchpartwithutsendingskanal', method: 'POST', body }),
    }),
    searchEnhetmappe: builder.query<{ id: number; navn: string }[], string>({
      query: (enhetId) => ({ url: `/search/gosysoppgavemapper/${enhetId}`, method: 'GET' }),
    }),
    searchEnheter: builder.query<Enhet[], { enhetsnr?: string; enhetsnavn?: string }>({
      query: (params) => ({ url: '/search/enheter', method: 'GET', params }),
    }),
  }),
});

export const { useLazySearchpartwithutsendingskanalQuery, useSearchEnhetmappeQuery, useSearchEnheterQuery } = searchApi;
