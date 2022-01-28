import { createApi } from '@reduxjs/toolkit/query/react';
import { IOppgavebehandlingBaseParams } from '../types/oppgavebehandling-params';
import { KABAL_OPPGAVEBEHANDLING_BASE_QUERY } from './common';

export interface SmartEditorIdResponse {
  smartEditorId: string | null;
}

interface SmartEditorIdUpdateResponse {
  modified: string;
}

export const smartEditorIdApi = createApi({
  reducerPath: 'smartEditorIdApi',
  tagTypes: ['smart-editor'],
  baseQuery: KABAL_OPPGAVEBEHANDLING_BASE_QUERY,
  endpoints: (builder) => ({
    getSmartEditorId: builder.query<SmartEditorIdResponse, string>({
      query: (oppgaveId) => `/${oppgaveId}/smarteditorid`,
      providesTags: ['smart-editor'],
    }),
    updateSmartEditorId: builder.mutation<
      SmartEditorIdUpdateResponse,
      SmartEditorIdResponse & IOppgavebehandlingBaseParams
    >({
      query: ({ smartEditorId, oppgaveId }) => ({
        url: `/${oppgaveId}/smarteditorid`,
        method: 'PUT',
        body: { smartEditorId },
      }),
      onQueryStarted: async ({ smartEditorId, oppgaveId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          smartEditorIdApi.util.updateQueryData('getSmartEditorId', oppgaveId, (draft) => {
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
      query: (oppgaveId) => ({
        url: `/${oppgaveId}/smarteditorid`,
        method: 'DELETE',
      }),
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          smartEditorIdApi.util.updateQueryData('getSmartEditorId', oppgaveId, (draft) => {
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
