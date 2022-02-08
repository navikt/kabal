import { createApi } from '@reduxjs/toolkit/query/react';
import { ISmartDocument } from '../types/documents';
import { IDocumentParams } from '../types/documents-common-params';
import { IOppgavebehandlingBaseParams } from '../types/oppgavebehandling-params';
import { ISmartEditorElement } from '../types/smart-editor';
import { ICreateSmartDocumentParams, IUpdateSmartDocumentParams } from '../types/smart-editor-params';
import { ISmartEditorRawResponse, ISmartEditorResponse } from '../types/smart-editor-response';
import { KABAL_BEHANDLINGER_BASE_QUERY } from './common';
import { documentsApi } from './documents';

export const smartEditorApi = createApi({
  reducerPath: 'smartEditorApi',
  baseQuery: KABAL_BEHANDLINGER_BASE_QUERY,
  endpoints: (builder) => ({
    getSmartDocuments: builder.query<ISmartDocument[], IOppgavebehandlingBaseParams>({
      query: ({ oppgaveId }) => `${oppgaveId}/dokumenter/smart`,
    }),
    createSmartDocument: builder.mutation<ISmartDocument, ICreateSmartDocumentParams>({
      query: ({ oppgaveId, content, tittel }) => ({
        url: `/${oppgaveId}/dokumenter/smart`,
        method: 'POST',
        body: {
          tittel,
          json: JSON.stringify(content),
        },
      }),
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(documentsApi.util.updateQueryData('getDocuments', { oppgaveId }, (draft) => [...draft, data]));
      },
    }),
    getSmartEditor: builder.query<ISmartEditorResponse | null, IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => `${oppgaveId}/dokumenter/smarteditor/${dokumentId}`,
      transformResponse: ({ id, created, modified, json }: ISmartEditorRawResponse) => ({
        id,
        created,
        modified,
        content: JSON.parse(json) as ISmartEditorElement[],
      }),
    }),
    updateSmartEditor: builder.mutation<ISmartEditorResponse, IUpdateSmartDocumentParams>({
      query: ({ oppgaveId, dokumentId, content }) => ({
        url: `${oppgaveId}/dokumenter/smarteditor/${dokumentId}`,
        method: 'PUT',
        body: content,
      }),
      onQueryStarted: async (params, { dispatch, queryFulfilled }) => {
        const query: IDocumentParams = { oppgaveId: params.oppgaveId, dokumentId: params.dokumentId };
        const patchResult = dispatch(
          smartEditorApi.util.updateQueryData('getSmartEditor', query, (draft) => {
            if (draft !== null) {
              draft.content = params.content;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            smartEditorApi.util.updateQueryData('getSmartEditor', query, (draft) => {
              if (draft !== null) {
                draft.modified = data.modified;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useCreateSmartDocumentMutation,
  useGetSmartDocumentsQuery,
  useGetSmartEditorQuery,
  useUpdateSmartEditorMutation,
} = smartEditorApi;
