import { createApi } from '@reduxjs/toolkit/query/react';
import { KAKA_KVALITETSVURDERING_BASE_QUERY } from '@/redux-api/common';
import type {
  IKvalitetsvurderingAnkeITRAfter2027,
  KvalitetsvurderingDataAnkeITRAfter2027,
} from '@/types/kaka-kvalitetsvurdering/anke-i-tr-after-2027';

type Argument = Partial<KvalitetsvurderingDataAnkeITRAfter2027> & Pick<IKvalitetsvurderingAnkeITRAfter2027, 'id'>;

export const kvalitetsvurderingAnkeITRAfter2027Api = createApi({
  reducerPath: 'kvalitetsvurderingAnkeITRAfter2027Api',
  baseQuery: KAKA_KVALITETSVURDERING_BASE_QUERY,
  tagTypes: ['kvalitetsvurdering'],
  endpoints: (builder) => ({
    getKvalitetsvurdering: builder.query<IKvalitetsvurderingAnkeITRAfter2027, string>({
      query: (id) => `/anke-i-tr-after-2027/${id}`,
      providesTags: (_, __, id) => [{ type: 'kvalitetsvurdering', id }],
    }),
    updateKvalitetsvurdering: builder.mutation<IKvalitetsvurderingAnkeITRAfter2027, Argument>({
      query: ({ id, ...body }) => ({
        url: `/anke-i-tr-after-2027/${id}`,
        method: 'PATCH',
        body,
      }),
      onQueryStarted: async ({ id, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          kvalitetsvurderingAnkeITRAfter2027Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => ({
            ...draft,
            ...update,
          })),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            kvalitetsvurderingAnkeITRAfter2027Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => {
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
  kvalitetsvurderingAnkeITRAfter2027Api;
