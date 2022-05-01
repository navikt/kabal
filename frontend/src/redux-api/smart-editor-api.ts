import { createApi } from '@reduxjs/toolkit/query/react';
import { parseJSON } from '../functions/parse-json';
import { ISmartDocument } from '../types/documents';
import { IOppgavebehandlingBaseParams } from '../types/oppgavebehandling-params';
import {
  ICreateSmartDocumentParams,
  IGetSmartEditorParams,
  IPatchSmartDocumentParams,
  IUpdateSmartDocumentParams,
} from '../types/smart-editor-params';
import {
  ISmartEditorPatchResponse,
  ISmartEditorRawResponse,
  ISmartEditorResponse,
} from '../types/smart-editor-response';
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
      query: ({ oppgaveId, children, tittel }) => ({
        url: `/${oppgaveId}/dokumenter/smart`,
        method: 'POST',
        body: {
          tittel,
          json: JSON.stringify(children),
        },
      }),
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(documentsApi.util.updateQueryData('getDocuments', { oppgaveId }, (draft) => [...draft, data]));
      },
    }),
    getSmartEditor: builder.query<ISmartEditorResponse | null, IGetSmartEditorParams>({
      query: ({ oppgaveId, dokumentId }) => `${oppgaveId}/dokumenter/smarteditor/${dokumentId}`,
      transformResponse: ({ id, created, modified, patchVersion, json }: ISmartEditorRawResponse) => ({
        id,
        created,
        modified,
        content: parseJSON(json) ?? [],
        patchVersion,
      }),
    }),
    patchSmartEditor: builder.mutation<ISmartEditorPatchResponse, IPatchSmartDocumentParams>({
      query: ({ oppgaveId, dokumentId, ...body }) => ({
        url: `/${oppgaveId}/dokumenter/smarteditor/${dokumentId}`,
        method: 'PATCH',
        body,
      }),
    }),
    updateSmartEditor: builder.mutation<ISmartEditorResponse, IUpdateSmartDocumentParams>({
      query: ({ oppgaveId, dokumentId, content }) => ({
        url: `${oppgaveId}/dokumenter/smarteditor/${dokumentId}`,
        method: 'PUT',
        body: content,
      }),
      transformResponse: ({ id, created, modified, json }: ISmartEditorRawResponse) => ({
        id,
        created,
        modified,
        content: parseJSON(json) ?? [],
        patchVersion: -1,
      }),
      onQueryStarted: async ({ dokumentId, oppgaveId, content }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          smartEditorApi.util.updateQueryData('getSmartEditor', { dokumentId, oppgaveId }, (draft) => {
            if (draft !== null) {
              draft.content = content;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            smartEditorApi.util.updateQueryData('getSmartEditor', { dokumentId, oppgaveId }, (draft) => {
              if (draft !== null) {
                draft.modified = data.modified;
                draft.content = data.content;
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
  usePatchSmartEditorMutation,
} = smartEditorApi;
