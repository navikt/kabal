import type { IKvalitetsvurdering, IKvalitetsvurderingData } from '@app/types/kaka-kvalitetsvurdering/v2';
import { createApi } from '@reduxjs/toolkit/query/react';
import { KAKA_KVALITETSVURDERING_BASE_QUERY } from '../common';

type Argument = Partial<IKvalitetsvurderingData> & Pick<IKvalitetsvurdering, 'id'>;

export const kvalitetsvurderingV2Api = createApi({
  reducerPath: 'kvalitetsvurderingV2Api',
  baseQuery: KAKA_KVALITETSVURDERING_BASE_QUERY,
  tagTypes: ['kvalitetsvurdering'],
  endpoints: (builder) => ({
    getKvalitetsvurdering: builder.query<IKvalitetsvurdering, string>({
      query: (id) => `/v2/${id}`,
      providesTags: (_, __, id) => [{ type: 'kvalitetsvurdering', id }],
    }),
    updateKvalitetsvurdering: builder.mutation<IKvalitetsvurdering, Argument>({
      query: ({ id, ...body }) => ({
        url: `/v2/${id}`,
        method: 'PATCH',
        body,
      }),
      onQueryStarted: async ({ id, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          kvalitetsvurderingV2Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => ({
            ...draft,
            ...update,
          })),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            kvalitetsvurderingV2Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => {
              draft.modified = data.modified;
            }),
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetKvalitetsvurderingQuery, useUpdateKvalitetsvurderingMutation } = kvalitetsvurderingV2Api;
