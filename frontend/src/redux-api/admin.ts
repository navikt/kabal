import { createApi } from '@reduxjs/toolkit/query/react';
import { OppgaveType } from '../types/kodeverk';
import { apiUrl, staggeredBaseQuery } from './common';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    rebuildElasticAdmin: builder.mutation<void, void>({
      query: () => ({
        url: `/api/kabal-search/internal/elasticadmin/rebuild`,
        method: 'POST',
      }),
    }),
    refillElasticAdmin: builder.mutation<void, OppgaveType>({
      query: (type) => ({
        url: `${apiUrl(type)}internal/kafkaadmin/refill`,
        method: 'POST',
      }),
    }),
    resendDvh: builder.mutation<void, OppgaveType>({
      query: (type) => ({
        url: `${apiUrl(type)}internal/dvh/resend`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useRebuildElasticAdminMutation, useRefillElasticAdminMutation, useResendDvhMutation } = adminApi;
