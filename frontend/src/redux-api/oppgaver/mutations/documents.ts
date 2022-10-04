/* eslint-disable max-lines */
import { reduxStore } from '../../../redux/configure-store';
import { IDocumentParams } from '../../../types/documents/common-params';
import { IFileDocument, IMainDocument } from '../../../types/documents/documents';
import {
  ICreateFileDocumentParams,
  IFinishDocumentParams,
  ISetNameParams,
  ISetParentParams,
  ISetTypeParams,
} from '../../../types/documents/params';
import { ISmartEditor } from '../../../types/smart-editor/smart-editor';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { documentsQuerySlice } from '../queries/documents';
import { smartEditorQuerySlice } from '../queries/smart-editor';

const documentsMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    setType: builder.mutation<IMainDocument, ISetTypeParams>({
      query: ({ oppgaveId, dokumentId, dokumentTypeId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/dokumenttype`,
        body: {
          dokumentTypeId,
        },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, dokumentTypeId, oppgaveId }, { queryFulfilled }) => {
        const undo = optimisticUpdate(oppgaveId, dokumentId, 'dokumentTypeId', dokumentTypeId);

        try {
          await queryFulfilled;
        } catch {
          undo();
        }
      },
    }),
    setTitle: builder.mutation<void, ISetNameParams>({
      query: ({ oppgaveId, dokumentId, title }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/tittel`,
        body: {
          title,
        },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, title, oppgaveId }, { queryFulfilled }) => {
        const undo = optimisticUpdate(oppgaveId, dokumentId, 'tittel', title);

        try {
          await queryFulfilled;
        } catch {
          undo();
        }
      },
    }),
    setParent: builder.mutation<IMainDocument, ISetParentParams>({
      query: ({ oppgaveId, dokumentId, parentId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/parent`,
        body: {
          dokumentId: parentId,
        },
        method: 'PUT',
      }),
      onQueryStarted: async ({ parentId, dokumentId, oppgaveId }, { queryFulfilled }) => {
        const undo = optimisticUpdate(oppgaveId, dokumentId, 'parent', parentId);

        try {
          await queryFulfilled;
        } catch {
          undo();
        }
      },
    }),
    finishDocument: builder.mutation<IMainDocument, IFinishDocumentParams>({
      query: ({ oppgaveId, dokumentId, brevmottakertypeIds }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/ferdigstill`,
        method: 'POST',
        body: { brevmottakertypeIds },
      }),
      onQueryStarted: async ({ dokumentId, oppgaveId }, { dispatch, queryFulfilled }) => {
        const documentsPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', { oppgaveId }, (draft) =>
            draft.map((doc) =>
              doc.id === dokumentId || doc.parent === dokumentId ? { ...doc, isMarkertAvsluttet: true } : doc
            )
          )
        );

        const smartEditorPatchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { oppgaveId, dokumentId }, () => null)
        );

        const smartEditorsPatchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditors', { oppgaveId }, (draft) =>
            draft.filter(({ id }) => id !== dokumentId)
          )
        );

        try {
          await queryFulfilled;
        } catch {
          documentsPatchResult.undo();
          smartEditorPatchResult.undo();
          smartEditorsPatchResult.undo();
        }
      },
    }),
    deleteDocument: builder.mutation<void, IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ dokumentId, ...baseParams }, { dispatch, queryFulfilled }) => {
        const documentsPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData(
            'getDocuments',
            baseParams,
            (draft) => draft.filter(({ id, parent }) => id !== dokumentId || parent === dokumentId) // Remove deleted document from list.
          )
        );

        const smartEditorPatchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { ...baseParams, dokumentId }, () => null)
        );

        const smartEditorsPatchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData(
            'getSmartEditors',
            baseParams,
            (draft) => draft.filter(({ id, parent }) => id !== dokumentId || parent === dokumentId) // Remove deleted document from list.
          )
        );

        try {
          await queryFulfilled;
        } catch {
          documentsPatchResult.undo();
          smartEditorPatchResult.undo();
          smartEditorsPatchResult.undo();
        }
      },
    }),
    uploadFileDocument: builder.mutation<IFileDocument, ICreateFileDocumentParams>({
      query: ({ oppgaveId, file }) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/fil`,
          method: 'POST',
          body: formData,
        };
      },
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(documentsQuerySlice.util.updateQueryData('getDocuments', { oppgaveId }, (draft) => [data, ...draft]));
      },
    }),
  }),
});

const optimisticUpdate = <K extends keyof ISmartEditor & keyof IMainDocument>(
  oppgaveId: string,
  dokumentId: string,
  key: K,
  value: (ISmartEditor & IMainDocument)[K]
) => {
  const documentsPatchResult = reduxStore.dispatch(
    documentsQuerySlice.util.updateQueryData('getDocuments', { oppgaveId }, (draft) =>
      draft.map((doc) => (doc.id === dokumentId ? { ...doc, [key]: value } : doc))
    )
  );

  const smartEditorsPatchResult = reduxStore.dispatch(
    smartEditorQuerySlice.util.updateQueryData('getSmartEditors', { oppgaveId }, (draft) =>
      draft.map((doc) => (doc.id === dokumentId ? { ...doc, [key]: value } : doc))
    )
  );

  const smartEditorPatchResult = reduxStore.dispatch(
    smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { oppgaveId, dokumentId }, (draft) => {
      if (draft !== null) {
        return {
          ...draft,
          [key]: value,
        };
      }

      return draft;
    })
  );

  return () => {
    documentsPatchResult.undo();
    smartEditorsPatchResult.undo();
    smartEditorPatchResult.undo();
  };
};

export const {
  useDeleteDocumentMutation,
  useFinishDocumentMutation,
  useSetTitleMutation,
  useSetTypeMutation,
  useUploadFileDocumentMutation,
  useSetParentMutation,
} = documentsMutationSlice;
