import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { KABAL_API_BASE_QUERY } from '@app/redux-api/common';
import { isApiRejectionError } from '@app/types/errors';
import { SvarbrevSetting, UpdateSvarbrevSettingParams } from '@app/types/svarbrev';

export const svarbrevApi = createApi({
  reducerPath: 'svarbrevApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    getSvarbrevSettings: builder.query<SvarbrevSetting[], void>({
      query: () => ({ url: `/svarbrev-settings`, method: 'GET' }),
    }),
    updateSvarbrevSetting: builder.mutation<SvarbrevSetting, UpdateSvarbrevSettingParams>({
      query: ({ id, ...body }) => ({ url: `/svarbrev-settings/${id}`, method: 'PUT', body }),
      onQueryStarted: async (params, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          svarbrevApi.util.updateQueryData('getSvarbrevSettings', undefined, (draft) =>
            draft.map((setting) => (setting.id === params.id ? { ...setting, ...params } : setting)),
          ),
        );

        try {
          await queryFulfilled;
          toast.success('Innstilling oppdatert!');
        } catch (error) {
          patchResult.undo();
          const message = 'Oppdatering av innstilling feilet';

          if (isApiRejectionError(error)) {
            apiErrorToast(message, error.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
  }),
});

export const { useGetSvarbrevSettingsQuery, useUpdateSvarbrevSettingMutation } = svarbrevApi;
