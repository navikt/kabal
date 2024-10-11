import { KABAL_API_BASE_QUERY } from '@app/redux-api/common';
import type { IPart } from '@app/types/oppgave-common';
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
  }),
});

export const { useLazySearchpartwithutsendingskanalQuery } = searchApi;
