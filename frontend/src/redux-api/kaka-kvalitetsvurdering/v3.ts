import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { isApiRejectionError } from '@app/types/errors';
import type { IKvalitetsvurdering, KvalitetsvurderingDataV3 } from '@app/types/kaka-kvalitetsvurdering/v3';
import { createApi } from '@reduxjs/toolkit/query/react';
import { KAKA_KVALITETSVURDERING_BASE_QUERY } from '../common';

type Argument = Partial<KvalitetsvurderingDataV3> & Pick<IKvalitetsvurdering, 'id'>;

export const kvalitetsvurderingV3Api = createApi({
  reducerPath: 'kvalitetsvurderingV3Api',
  baseQuery: KAKA_KVALITETSVURDERING_BASE_QUERY,
  tagTypes: ['kvalitetsvurdering'],
  endpoints: (builder) => ({
    getKvalitetsvurdering: builder.query<IKvalitetsvurdering, string>({
      query: (id) => `/v3/${id}`,
      providesTags: (_, __, id) => [{ type: 'kvalitetsvurdering', id }],
    }),
    updateKvalitetsvurdering: builder.mutation<IKvalitetsvurdering, Argument>({
      query: ({ id, ...body }) => ({
        url: `/v3/${id}`,
        method: 'PATCH',
        body,
      }),
      onQueryStarted: async ({ id, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          kvalitetsvurderingV3Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => ({
            ...draft,
            ...update,
          })),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            kvalitetsvurderingV3Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => {
              draft.modified = data.modified;
            }),
          );
        } catch (error) {
          patchResult.undo();

          const heading = 'Kunne ikke oppdatere kvalitetsvurdering';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
  }),
});

export const { useGetKvalitetsvurderingQuery, useUpdateKvalitetsvurderingMutation } = kvalitetsvurderingV3Api;
