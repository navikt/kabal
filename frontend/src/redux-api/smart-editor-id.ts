import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';

export interface SmartEditorIdResponse {
  smartEditorId: string | null;
}

interface SmartEditorIdUpdate extends SmartEditorIdResponse {
  klagebehandlingId: string;
}

interface SmartEditorIdUpdateResponse {
  modified: string;
}

export const smartEditorIdApi = createApi({
  reducerPath: 'smartEditorIdApi',
  tagTypes: ['smart-editor'],
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getSmartEditorId: builder.query<SmartEditorIdResponse, string>({
      query: (klagebehandlingId) => `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/smarteditorid`,
      providesTags: ['smart-editor'],
    }),
    updateSmartEditorId: builder.mutation<SmartEditorIdUpdateResponse, SmartEditorIdUpdate>({
      query: ({ smartEditorId, klagebehandlingId }) => ({
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/smarteditorid`,
        method: 'PUT',
        body: { smartEditorId },
      }),
      onQueryStarted: async ({ klagebehandlingId, smartEditorId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          smartEditorIdApi.util.updateQueryData('getSmartEditorId', klagebehandlingId, (draft) => {
            draft.smartEditorId = smartEditorId;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['smart-editor'],
    }),
    deleteSmartEditorId: builder.mutation<SmartEditorIdUpdateResponse, string>({
      query: (klagebehandlingId) => ({
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/smarteditorid`,
        method: 'DELETE',
      }),
      onQueryStarted: async (klagebehandlingId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          smartEditorIdApi.util.updateQueryData('getSmartEditorId', klagebehandlingId, (draft) => {
            draft.smartEditorId = null;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['smart-editor'],
    }),
  }),
});

export const { useGetSmartEditorIdQuery, useUpdateSmartEditorIdMutation, useDeleteSmartEditorIdMutation } =
  smartEditorIdApi;
