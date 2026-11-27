import { createApi } from '@reduxjs/toolkit/query/react';
import { KANT_BASE_QUERY } from '@/redux-api/common';
import type {
  IKvalitetsvurderingAnkeAfter2027,
  KvalitetsvurderingDataAnkeAfter2027,
} from '@/types/kvalitetsvurdering/anke-after-2027';

type Argument = KvalitetsvurderingDataAnkeAfter2027 & Pick<IKvalitetsvurderingAnkeAfter2027, 'type'> & { id: string };

interface SaksdataResponse {
  kvalitetsvurdering: IKvalitetsvurderingAnkeAfter2027;
}

export const kvalitetsvurderingAnkeAfter2027Api = createApi({
  reducerPath: 'kvalitetsvurderingAnkeAfter2027Api',
  baseQuery: KANT_BASE_QUERY,
  tagTypes: ['kvalitetsvurdering'],
  endpoints: (builder) => ({
    getKvalitetsvurdering: builder.query<IKvalitetsvurderingAnkeAfter2027, string>({
      query: (id) => `/${id}/kvalitetsvurdering`,
      providesTags: (_, __, id) => [{ type: 'kvalitetsvurdering', id }],
    }),
    updateKvalitetsvurdering: builder.mutation<IKvalitetsvurderingAnkeAfter2027, Argument>({
      query: ({ id, ...body }) => ({
        url: `/${id}/kvalitetsvurdering`,
        method: 'PUT',
        body,
      }),
      transformResponse: ({ kvalitetsvurdering }: SaksdataResponse) => kvalitetsvurdering,
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
            kvalitetsvurderingAnkeAfter2027Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => ({
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
  kvalitetsvurderingAnkeAfter2027Api;
