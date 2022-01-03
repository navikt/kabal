import { createApi } from '@reduxjs/toolkit/query/react';
import { IKodeverk } from '../types/kodeverk';
import { staggeredBaseQuery } from './common';

export const kodeverkApi = createApi({
  reducerPath: 'kodeverkApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getKodeverk: builder.query<IKodeverk, void>({
      query: () => '/api/klage-kodeverk-api/kodeverk',
    }),
  }),
});

export const { useGetKodeverkQuery } = kodeverkApi;
