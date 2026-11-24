import { createApi } from '@reduxjs/toolkit/query/react';
import { KANT_BASE_QUERY } from '@/redux-api/common';
import type {
  IKvalitetsvurderingAnkeITRAfter2027,
  KvalitetsvurderingDataAnkeITRAfter2027,
} from '@/types/kvalitetsvurdering/anke-i-tr-after-2027';

type Argument = KvalitetsvurderingDataAnkeITRAfter2027 &
  Pick<IKvalitetsvurderingAnkeITRAfter2027, 'type'> & { id: string };

interface SaksdataResponse {
  kvalitetsvurdering: IKvalitetsvurderingAnkeITRAfter2027;
}

export const kvalitetsvurderingAnkeITRAfter2027Api = createApi({
  reducerPath: 'kvalitetsvurderingAnkeITRAfter2027Api',
  baseQuery: KANT_BASE_QUERY,
  tagTypes: ['kvalitetsvurdering'],
  endpoints: (builder) => ({
    getKvalitetsvurdering: builder.query<IKvalitetsvurderingAnkeITRAfter2027, string>({
      query: (id) => `/${id}/kvalitetsvurdering`,
      providesTags: (_, __, id) => [{ type: 'kvalitetsvurdering', id }],
    }),
    updateKvalitetsvurdering: builder.mutation<IKvalitetsvurderingAnkeITRAfter2027, Argument>({
      query: ({ id, ...body }) => ({
        url: `/${id}/kvalitetsvurdering`,
        method: 'PUT',
        body,
      }),
      transformResponse: ({ kvalitetsvurdering }: SaksdataResponse) => kvalitetsvurdering,
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
            kvalitetsvurderingAnkeITRAfter2027Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => ({
              ...draft,
              ...data,
            })),
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
