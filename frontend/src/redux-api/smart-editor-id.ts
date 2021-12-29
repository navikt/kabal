import { createApi } from '@reduxjs/toolkit/query/react';
import { oppgavebehandlingApiUrl, staggeredBaseQuery } from './common';
import { IOppgavebehandlingBaseParams } from './oppgavebehandling-params-types';

export interface SmartEditorIdResponse {
  smartEditorId: string | null;
}

// interface SmartEditorIdUpdate extends SmartEditorIdResponse {
//   oppgavebehandlingId: string;
// }

interface SmartEditorIdUpdateResponse {
  modified: string;
}

export const smartEditorIdApi = createApi({
  reducerPath: 'smartEditorIdApi',
  tagTypes: ['smart-editor'],
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getSmartEditorId: builder.query<SmartEditorIdResponse, IOppgavebehandlingBaseParams>({
      query: ({ type, oppgaveId }) => `${oppgavebehandlingApiUrl(type)}${oppgaveId}/smarteditorid`,
      providesTags: ['smart-editor'],
    }),
    updateSmartEditorId: builder.mutation<
      SmartEditorIdUpdateResponse,
      SmartEditorIdResponse & IOppgavebehandlingBaseParams
    >({
      query: ({ smartEditorId, type, oppgaveId }) => ({
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/smarteditorid`,
        method: 'PUT',
        body: { smartEditorId },
      }),
      onQueryStarted: async ({ smartEditorId, type, oppgaveId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          smartEditorIdApi.util.updateQueryData('getSmartEditorId', { oppgaveId, type }, (draft) => {
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
    deleteSmartEditorId: builder.mutation<SmartEditorIdUpdateResponse, IOppgavebehandlingBaseParams>({
      query: ({ type, oppgaveId }) => ({
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/smarteditorid`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ type, oppgaveId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          smartEditorIdApi.util.updateQueryData('getSmartEditorId', { oppgaveId, type }, (draft) => {
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
