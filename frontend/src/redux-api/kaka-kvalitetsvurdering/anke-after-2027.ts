import { createApi } from '@reduxjs/toolkit/query/react';
import { KAKA_KVALITETSVURDERING_BASE_QUERY } from '@/redux-api/common';
import type {
  IKvalitetsvurderingAnkeAfter2027,
  KvalitetsvurderingDataAnkeAfter2027,
} from '@/types/kaka-kvalitetsvurdering/anke-after-2027';

type Argument = Partial<KvalitetsvurderingDataAnkeAfter2027> & Pick<IKvalitetsvurderingAnkeAfter2027, 'id'>;

export const kvalitetsvurderingAnkeAfter2027Api = createApi({
  reducerPath: 'kvalitetsvurderingAnkeAfter2027Api',
  baseQuery: KAKA_KVALITETSVURDERING_BASE_QUERY,
  tagTypes: ['kvalitetsvurdering'],
  endpoints: (builder) => ({
    getKvalitetsvurdering: builder.query<IKvalitetsvurderingAnkeAfter2027, string>({
      query: (id) => `/anke-after-2027/${id}`,
      providesTags: (_, __, id) => [{ type: 'kvalitetsvurdering', id }],
    }),
    updateKvalitetsvurdering: builder.mutation<IKvalitetsvurderingAnkeAfter2027, Argument>({
      query: ({ id, ...body }) => ({
        url: `/anke-after-2027/${id}`,
        method: 'PATCH',
        body,
      }),
      onQueryStarted: async ({ id, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          kvalitetsvurderingAnkeAfter2027Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => ({
            ...draft,
            ...update,
          })),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            kvalitetsvurderingAnkeAfter2027Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => {
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

export const { useGetKvalitetsvurderingQuery, useUpdateKvalitetsvurderingMutation } =
  kvalitetsvurderingAnkeAfter2027Api;
