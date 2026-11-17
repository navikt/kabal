import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_API_BASE_QUERY } from '@/redux-api/common';
import type { IdentifikatorPart, Utsendingskanal } from '@/types/oppgave-common';
import type { Enhet } from '@/types/oppgavebehandling/oppgavebehandling';

export type PartWithUtsendingskanal = IdentifikatorPart & { utsendingskanal: Utsendingskanal };

interface SearchPartWithUtsendingskanalParams {
  identifikator: string;
  sakenGjelderId: string;
  ytelseId: string;
}

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    searchPartWithUtsendingskanal: builder.query<PartWithUtsendingskanal, SearchPartWithUtsendingskanalParams>({
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

export const {
  useSearchPartWithUtsendingskanalQuery,
  useLazySearchPartWithUtsendingskanalQuery,
  useSearchEnhetmappeQuery,
  useSearchEnheterQuery,
} = searchApi;
