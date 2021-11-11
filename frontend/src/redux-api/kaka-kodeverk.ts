import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';
import { IKakaKodeverk } from './kaka-kodeverk-types';

export const kakaKodeverkApi = createApi({
  reducerPath: 'kakaKodeverkApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getKodeverk: builder.query<IKakaKodeverk, void>({
      query: () => '/api/kaka-api/metadata/kodeverk',
    }),
  }),
});

export const { useGetKodeverkQuery } = kakaKodeverkApi;
