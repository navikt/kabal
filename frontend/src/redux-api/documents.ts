import { createApi } from '@reduxjs/toolkit/query/react';
import { IFileDocument, IMainDocument } from '../types/documents';
import { IDocumentParams } from '../types/documents-common-params';
import { ICreateFileDocumentParams, ISetNameParams, ISetParentParams, ISetTypeParams } from '../types/documents-params';
import { IOppgavebehandlingBaseParams } from '../types/oppgavebehandling-params';
import { DOMAIN, KABAL_BEHANDLINGER_BASE_PATH, KABAL_BEHANDLINGER_BASE_QUERY } from './common';
import { oppgavebehandlingApi } from './oppgavebehandling';
import { ServerSentEventManager, ServerSentEventType } from './server-sent-events';

export const documentsApi = createApi({
  reducerPath: 'documentsApi',
  baseQuery: KABAL_BEHANDLINGER_BASE_QUERY,
  endpoints: (builder) => ({
    getDocuments: builder.query<IMainDocument[], IOppgavebehandlingBaseParams>({
      query: ({ oppgaveId }) => `/${oppgaveId}/dokumenter`,
      onCacheEntryAdded: async ({ oppgaveId }, { updateCachedData, dispatch, cacheEntryRemoved, cacheDataLoaded }) => {
        try {
          await cacheDataLoaded;

          const events = new ServerSentEventManager(
            `${DOMAIN}${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/dokumenter/events`
          );

          events.addEventListener(ServerSentEventType.FINISHED, (event) => {
            if (event.data.length !== 0) {
              updateCachedData((draft) => {
                if (typeof draft === 'undefined' || draft.length === 0) {
                  return draft;
                }

                const filteredList = draft.filter(({ id, parent }) => !(id === event.data || parent === event.data)); // Remove finished document from list.

                if (filteredList.length !== draft.length) {
                  dispatch(oppgavebehandlingApi.util.invalidateTags(['dokumenter', 'tilknyttedeDokumenter']));
                }

                return filteredList;
              });
            }
          });

          await cacheEntryRemoved;

          events.close();
        } catch (err) {
          console.error(err);
        }
      },
    }),
    setType: builder.mutation<IMainDocument, ISetTypeParams>({
      query: ({ oppgaveId, dokumentId, dokumentTypeId }) => ({
        url: `/${oppgaveId}/dokumenter/${dokumentId}/dokumenttype`,
        body: {
          dokumentTypeId,
        },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, dokumentTypeId, ...baseParams }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          documentsApi.util.updateQueryData('getDocuments', baseParams, (draft) =>
            draft.map((doc) => (doc.id === dokumentId ? { ...doc, dokumentTypeId } : doc))
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    setTitle: builder.mutation<void, ISetNameParams>({
      query: ({ oppgaveId, dokumentId, title }) => ({
        url: `/${oppgaveId}/dokumenter/${dokumentId}/tittel`,
        body: {
          title,
        },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, title, ...baseParams }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          documentsApi.util.updateQueryData('getDocuments', baseParams, (draft) =>
            draft.map((doc) => (doc.id === dokumentId ? { ...doc, tittel: title } : doc))
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    setParent: builder.mutation<IMainDocument, ISetParentParams>({
      query: ({ oppgaveId, dokumentId, parentId }) => ({
        url: `/${oppgaveId}/dokumenter/${dokumentId}/parent`,
        body: {
          dokumentId: parentId,
        },
        method: 'PUT',
      }),
      onQueryStarted: async ({ parentId, dokumentId, ...baseParams }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          documentsApi.util.updateQueryData('getDocuments', baseParams, (draft) =>
            draft.map((doc) => (doc.id === dokumentId ? { ...doc, parent: parentId } : doc))
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    finishDocument: builder.mutation<IMainDocument, IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => ({
        url: `/${oppgaveId}/dokumenter/${dokumentId}/ferdigstill`,
        method: 'POST',
      }),
      onQueryStarted: async ({ dokumentId, ...baseParams }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          documentsApi.util.updateQueryData('getDocuments', baseParams, (draft) =>
            draft.map((doc) =>
              doc.id === dokumentId || doc.parent === dokumentId ? { ...doc, isMarkertAvsluttet: true } : doc
            )
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteDocument: builder.mutation<void, IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => ({
        url: `/${oppgaveId}/dokumenter/${dokumentId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ dokumentId, ...baseParams }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          documentsApi.util.updateQueryData(
            'getDocuments',
            baseParams,
            (draft) => draft.filter(({ id, parent }) => id !== dokumentId || parent === dokumentId) // Remove deleted document from list.
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    uploadFileDocument: builder.mutation<IFileDocument, ICreateFileDocumentParams>({
      query: ({ oppgaveId, file }) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: `/${oppgaveId}/dokumenter/fil`,
          method: 'POST',
          body: formData,
        };
      },
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(documentsApi.util.updateQueryData('getDocuments', { oppgaveId }, (draft) => [...draft, data]));
      },
    }),
  }),
});

export const {
  useDeleteDocumentMutation,
  useFinishDocumentMutation,
  useGetDocumentsQuery,
  useSetTitleMutation,
  useSetParentMutation,
  useSetTypeMutation,
  useUploadFileDocumentMutation,
} = documentsApi;
