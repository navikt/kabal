import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';
import {
  IKakaKvalitetsvurdering,
  IKvalitetsvurderingBooleans,
  IKvalitetsvurderingRadio,
  IKvalitetsvurderingRadioExtended,
  IKvalitetsvurderingTexts,
} from './kaka-kvalitetsvurdering-types';

type WithId = Pick<IKakaKvalitetsvurdering, 'id'>;

export type UpdateBoolean = Partial<IKvalitetsvurderingBooleans> & WithId;
export type UpdateText = Partial<IKvalitetsvurderingTexts> & WithId;
export type UpdateRadio = Partial<IKvalitetsvurderingRadio> & WithId;
export type UpdateRadioExtended = Partial<IKvalitetsvurderingRadioExtended> & WithId;

export const kvalitetsvurderingApi = createApi({
  reducerPath: 'kvalitetsvurderingApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getKvalitetsvurdering: builder.query<IKakaKvalitetsvurdering, string>({
      query: (id) => `/api/kaka-api/kvalitetsvurdering/${id}`,
    }),
    updateKvalitetsvurdering: builder.mutation<
      IKakaKvalitetsvurdering,
      UpdateBoolean | UpdateText | UpdateRadio | UpdateRadioExtended
    >({
      query: ({ id, ...body }) => {
        const [[key, value], ...rest] = Object.entries(body);

        if (rest.length !== 0) {
          throw new Error('Only one key allowed');
        }

        return {
          url: `/api/kaka-api/kvalitetsvurdering/${id}/${key.toLowerCase()}`,
          method: 'PUT',
          body: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value,
          },
        };
      },
      onQueryStarted: async ({ id, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          kvalitetsvurderingApi.util.updateQueryData('getKvalitetsvurdering', id, (draft) =>
            Object.assign(draft, update)
          )
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            kvalitetsvurderingApi.util.updateQueryData('getKvalitetsvurdering', id, (draft) => {
              draft.modified = data.modified;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetKvalitetsvurderingQuery, useUpdateKvalitetsvurderingMutation } = kvalitetsvurderingApi;
