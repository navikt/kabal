import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';

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
    refillElasticAdminKlage: builder.mutation<void, void>({
      query: () => ({
        url: `/api/kabal-api/internal/kafkaadmin/refill`,
        method: 'POST',
      }),
    }),
    resendDvhKlage: builder.mutation<void, void>({
      query: () => ({
        url: `/api/kabal-api/internal/dvh/resend`,
        method: 'POST',
      }),
    }),

    refillElasticAdminAnke: builder.mutation<void, void>({
      query: () => ({
        url: `/api/kabal-anke-api/internal/kafkaadmin/refill`,
        method: 'POST',
      }),
    }),
    resendDvhAnke: builder.mutation<void, void>({
      query: () => ({
        url: `/api/kabal-anke-api/internal/dvh/resend`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRebuildElasticAdminMutation,
  useRefillElasticAdminKlageMutation,
  useResendDvhKlageMutation,
  useRefillElasticAdminAnkeMutation,
  useResendDvhAnkeMutation,
} = adminApi;
