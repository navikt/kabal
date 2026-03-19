import { createApi } from '@reduxjs/toolkit/query/react';
import { format } from 'date-fns';
import { ISO_DATETIME_FORMAT } from '@/components/date-picker/constants';
import { toast } from '@/components/toast/store';
import { KABAL_API_BASE_QUERY } from '@/redux-api/common';
import type { SvarbrevSetting, UpdateSvarbrevSettingParams } from '@/types/svarbrev';

export const svarbrevApi = createApi({
  reducerPath: 'svarbrevApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    getSvarbrevSettings: builder.query<SvarbrevSetting[], void>({
      query: () => ({ url: '/svarbrev-settings', method: 'GET' }),
    }),
    getSvarbrevSettingHistory: builder.query<SvarbrevSetting[], string>({
      query: (id) => ({ url: `/svarbrev-settings/${id}/history`, method: 'GET' }),
    }),
    updateSvarbrevSetting: builder.mutation<SvarbrevSetting, UpdateSvarbrevSettingParams>({
      query: ({ id, ...body }) => ({ url: `/svarbrev-settings/${id}`, method: 'PUT', body }),
      onQueryStarted: async ({ id, ...params }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          svarbrevApi.util.updateQueryData('getSvarbrevSettings', undefined, (draft) => {
            const now = format(new Date(), ISO_DATETIME_FORMAT);

            return draft.map((y) => (y.id === id ? { ...y, ...params, modified: now } : y));
          }),
        );

        try {
          const { data } = await queryFulfilled;
          toast.success('Innstilling oppdatert!');
          svarbrevApi.util.updateQueryData('getSvarbrevSettings', undefined, (draft) =>
            draft.map((y) => (y.id === id ? data : y)),
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetSvarbrevSettingsQuery, useGetSvarbrevSettingHistoryQuery, useUpdateSvarbrevSettingMutation } =
  svarbrevApi;
