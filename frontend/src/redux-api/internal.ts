import { ISO_DATETIME_FORMAT } from '@app/components/date-picker/constants';
import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { user } from '@app/static-data/static-data';
import { isApiRejectionError } from '@app/types/errors';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import { createApi } from '@reduxjs/toolkit/query/react';
import { format } from 'date-fns';
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
    completeMerkantilTask: builder.mutation<Task, { taskId: string; comment: string }>({
      query: ({ taskId, comment }) => ({
        url: `/kabal-api/internal/merkantil-tasks/${taskId}/complete`,
        method: 'POST',
        body: { comment },
      }),
      onQueryStarted: async ({ taskId, comment }, { dispatch, queryFulfilled }) => {
        const { navIdent, navn } = await user;

        const patchResult = dispatch(
          kabalInternalApi.util.updateQueryData('getMerkantilTasks', undefined, (draft) =>
            draft.map((task) => {
              if (task.id === taskId) {
                const dateHandled = format(new Date(), ISO_DATETIME_FORMAT);

                return { ...task, dateHandled, comment, handledBy: navIdent, handledByName: navn };
              }

              return task;
            }),
          ),
        );
        try {
          const { data } = await queryFulfilled;

          kabalInternalApi.util.updateQueryData('getMerkantilTasks', undefined, (draft) =>
            draft.map((task) => (task.id === taskId ? { ...task, ...data } : task)),
          );
        } catch (error) {
          patchResult.undo();

          const heading = 'Kunne ikke fullføre oppgave';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
    insertHjemlerInSettings: builder.mutation<void, { ytelseId: string; hjemmelIdList: string[] }>({
      query: (body) => ({
        url: '/kabal-innstillinger/admin/inserthjemlerinsettings',
        method: 'POST',
        body,
      }),
    }),
    logInaccessible: builder.mutation<void, void>({
      query: () => '/kabal-api/internal/log-inaccessible',
    }),
  }),
});

export const {
  useRefillElasticAdminMutation,
  useResendDvhMutation,
  useRecreateElasticAdminMutation,
  useGetMerkantilTasksQuery,
  useInsertHjemlerInSettingsMutation,
  useCompleteMerkantilTaskMutation,
  useLogInaccessibleMutation,
} = kabalInternalApi;
