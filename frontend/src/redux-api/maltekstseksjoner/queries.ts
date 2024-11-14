import { MaltekstseksjonTagTypes, maltekstseksjonerApi } from '@app/redux-api/maltekstseksjoner/maltekstseksjoner';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { IS_LOCALHOST } from '../common';

export const maltekstseksjonerQuerySlice = maltekstseksjonerApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getMaltekstseksjoner: builder.query<IMaltekstseksjon[], IGetMaltekstseksjonParams>({
      query: (params) => ({ url: '/maltekstseksjoner', params }),
      providesTags: (maltekstseksjoner) =>
        maltekstseksjoner
          ?.map(({ id }) => ({ type: MaltekstseksjonTagTypes.MALTEKSTSEKSJON, id }))
          .concat({ type: MaltekstseksjonTagTypes.MALTEKSTSEKSJON, id: 'LIST' }) ?? [
          { type: MaltekstseksjonTagTypes.MALTEKSTSEKSJON, id: 'LIST' },
        ],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const maltekstseksjon of data) {
          dispatch(
            maltekstseksjonerQuerySlice.util.upsertQueryData('getMaltekstseksjon', maltekstseksjon.id, maltekstseksjon),
          );
        }
      },
    }),
    getMaltekstseksjon: builder.query<IMaltekstseksjon, string>({
      query: (id) => `/maltekstseksjoner/${id}`,
      providesTags: (_, __, id) => [{ type: MaltekstseksjonTagTypes.MALTEKSTSEKSJON, id }],
    }),
    getMaltekstseksjonVersions: builder.query<IMaltekstseksjon[], string>({
      query: (id) => `/maltekstseksjoner/${id}/versions`,
      providesTags: (_, __, id) => [{ type: MaltekstseksjonTagTypes.MALTEKSTSEKSJON_VERSIONS, id }],
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        // First published or draft.
        const current = data.find((d) => d.published || d.publishedDateTime === null);

        dispatch(maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjon', id, () => current));
      },
    }),
  }),
});

export const { useGetMaltekstseksjonVersionsQuery, useGetMaltekstseksjonQuery, useGetMaltekstseksjonerQuery } =
  maltekstseksjonerQuerySlice;
