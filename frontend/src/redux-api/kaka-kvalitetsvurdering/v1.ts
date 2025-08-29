import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { isApiRejectionError } from '@app/types/errors';
import type {
  IKvalitetsvurderingBooleans,
  IKvalitetsvurderingRadio,
  IKvalitetsvurderingRadioExtended,
  IKvalitetsvurderingTexts,
  IKvalitetsvurderingV1,
} from '@app/types/kaka-kvalitetsvurdering/v1';
import { createApi } from '@reduxjs/toolkit/query/react';
import { KAKA_KVALITETSVURDERING_BASE_QUERY } from '../common';

type WithId = Pick<IKvalitetsvurderingV1, 'id'>;

type UpdateBoolean = Partial<IKvalitetsvurderingBooleans> & WithId;
type UpdateText = Partial<IKvalitetsvurderingTexts> & WithId;
type UpdateRadio = Partial<IKvalitetsvurderingRadio> & WithId;
type UpdateRadioExtended = Partial<IKvalitetsvurderingRadioExtended> & WithId;

type UpdateParam = UpdateBoolean | UpdateText | UpdateRadio | UpdateRadioExtended;

export const kvalitetsvurderingV1Api = createApi({
  reducerPath: 'kvalitetsvurderingV1Api',
  baseQuery: KAKA_KVALITETSVURDERING_BASE_QUERY,
  tagTypes: ['kvalitetsvurdering'],
  endpoints: (builder) => ({
    getKvalitetsvurdering: builder.query<IKvalitetsvurderingV1, string>({
      query: (id) => `/v1/${id}`,
      providesTags: (_, __, id) => [{ type: 'kvalitetsvurdering', id }],
    }),
    updateKvalitetsvurdering: builder.mutation<IKvalitetsvurderingV1, UpdateParam>({
      query: ({ id, ...body }) => ({
        url: `/v1/${id}`,
        method: 'PATCH',
        body,
      }),
      onQueryStarted: async ({ id, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          kvalitetsvurderingV1Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => ({
            ...draft,
            ...update,
          })),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            kvalitetsvurderingV1Api.util.updateQueryData('getKvalitetsvurdering', id, (draft) => {
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

export const { useGetKvalitetsvurderingQuery, useUpdateKvalitetsvurderingMutation } = kvalitetsvurderingV1Api;
