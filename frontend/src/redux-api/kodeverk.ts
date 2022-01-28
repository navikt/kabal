import { createApi } from '@reduxjs/toolkit/query/react';
import { IKodeverk } from '../types/kodeverk';
import { KODEVERK_BASE_QUERY } from './common';

export const kodeverkApi = createApi({
  reducerPath: 'kodeverkApi',
  baseQuery: KODEVERK_BASE_QUERY,
  endpoints: (builder) => ({
    getKodeverk: builder.query<IKodeverk, void>({
      query: () => '/kodeverk',
    }),
  }),
});

export const { useGetKodeverkQuery } = kodeverkApi;
