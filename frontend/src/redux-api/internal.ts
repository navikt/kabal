import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_INTERNAL_BASE_QUERY } from './common';

export const kabalInternalApi = createApi({
  reducerPath: 'kabalInternalApi',
  baseQuery: KABAL_INTERNAL_BASE_QUERY,
  endpoints: (builder) => ({
    refillElasticAdmin: builder.mutation<void, void>({
      query: () => ({
        url: '/kabal-api/internal/kafkaadmin/refill',
        method: 'POST',
      }),
    }),
    resendDvh: builder.mutation<void, void>({
      query: () => ({
        url: '/kabal-api/internal/dvh/resend',
        method: 'POST',
      }),
    }),
    recreateElasticAdmin: builder.mutation<void, void>({
      query: () => ({
        url: '/kabal-search/internal/elasticadmin/recreate',
        method: 'POST',
      }),
    }),
  }),
});

export const { useRefillElasticAdminMutation, useResendDvhMutation, useRecreateElasticAdminMutation } =
  kabalInternalApi;
