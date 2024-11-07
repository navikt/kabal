import type { SaksTypeEnum } from '@app/types/kodeverk';
import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_INTERNAL_BASE_QUERY } from './common';

export interface Task {
  id: string;
  created: string;
  typeId: SaksTypeEnum;
  behandlingId: string;
  reason: string;
  dateHandled: string | null;
  handledBy: string | null;
  handledByName: string | null;
  comment: string | null;
}

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
    getMerkantilTasks: builder.query<Task[], void>({
      query: () => '/kabal-api/internal/merkantil-tasks',
    }),
  }),
});

export const {
  useRefillElasticAdminMutation,
  useResendDvhMutation,
  useRecreateElasticAdminMutation,
  useGetMerkantilTasksQuery,
} = kabalInternalApi;
