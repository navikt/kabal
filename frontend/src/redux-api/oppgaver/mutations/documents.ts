/* eslint-disable max-lines */
import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { reduxStore } from '@app/redux/configure-store';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { IDocumentParams } from '@app/types/documents/common-params';
import { DistribusjonsType, DocumentTypeEnum, IFileDocument, IMainDocument } from '@app/types/documents/documents';
import {
  ICreateFileDocumentParams,
  ICreateVedleggFromJournalfoertDocumentParams,
  IFinishDocumentParams,
  ISetNameParams,
  ISetParentParams,
  ISetTypeParams,
} from '@app/types/documents/params';
import { ICreateVedleggFromJournalfoertDocumentResponse, ISetParentResponse } from '@app/types/documents/response';
import { isApiRejectionError } from '@app/types/errors';
import { ISmartEditor } from '@app/types/smart-editor/smart-editor';
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
        body: { dokumentTypeId },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, dokumentTypeId, oppgaveId }, { queryFulfilled }) => {
        const undo = optimisticUpdate(oppgaveId, dokumentId, 'dokumentTypeId', dokumentTypeId);

        try {
          await queryFulfilled;
        } catch {
          undo();
          toast.error('Kunne ikke endre dokumenttype.');
        }
      },
    }),
    setTitle: builder.mutation<void, ISetNameParams>({
      query: ({ oppgaveId, dokumentId, title }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/tittel`,
        body: { title },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, title, oppgaveId }, { queryFulfilled }) => {
        const undo = optimisticUpdate(oppgaveId, dokumentId, 'tittel', title);

        try {
          await queryFulfilled;
        } catch (e) {
          undo();

          const message = 'Kunne ikke endre tittel.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    setParent: builder.mutation<ISetParentResponse, ISetParentParams>({
      query: ({ oppgaveId, dokumentId, parentId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/parent`,
        body: { dokumentId: parentId },
        method: 'PUT',
      }),
      onQueryStarted: async ({ parentId, dokumentId, oppgaveId }, { queryFulfilled, dispatch }) => {
        const documentsPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => {
            const newDocuments: IMainDocument[] = [];

            for (const existing of draft) {
              if (existing.id === dokumentId || existing.parentId === dokumentId) {
                if (existing.type === DocumentTypeEnum.JOURNALFOERT) {
                  if (parentId === null) {
                    newDocuments.push(existing);
                    continue;
                  }

                  const isDuplicate = draft.some(
                    (doc) =>
                      doc.id !== existing.id &&
                      doc.parentId === parentId &&
                      doc.type === DocumentTypeEnum.JOURNALFOERT &&
                      doc.journalfoertDokumentReference.dokumentInfoId ===
                        existing.journalfoertDokumentReference.dokumentInfoId,
                  );

                  if (isDuplicate) {
                    continue;
                  }

                  newDocuments.push({ ...existing, parentId });
                  continue;
                }

                newDocuments.push({ ...existing, parentId });
                continue;
              }

              newDocuments.push(existing);
            }

            return newDocuments;
          }),
        );

        const smartEditorsPatchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditors', { oppgaveId }, (draft) =>
            draft.map((doc) => (doc.id === dokumentId ? { ...doc, parentId } : doc)),
          ),
        );

        const smartEditorPatchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { oppgaveId, dokumentId }, (draft) => {
            if (draft !== null) {
              return { ...draft, parentId };
            }

            return draft;
          }),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => {
              const newDocuments: IMainDocument[] = [];

              for (const oldDoc of draft) {
                let altered = false;

                // If document is altered, add it to the new list.
                for (const alteredDoc of data.alteredDocuments) {
                  if (oldDoc.id === alteredDoc.id) {
                    altered = true;
                    newDocuments.push(alteredDoc);
                    break;
                  }
                }

                // If it is altered, continue to next document.
                if (altered) {
                  continue;
                }

                // If it is not altered, check if it is a duplicate.
                const isDuplicate = data.duplicateJournalfoerteDokumenter.some(
                  (duplicate) => duplicate.id === oldDoc.id,
                );

                // If it is a duplicate, continue to next document.
                if (isDuplicate) {
                  continue;
                }

                newDocuments.push(oldDoc);
              }

              return newDocuments;
            }),
          );

          if (data.duplicateJournalfoerteDokumenter.length !== 0) {
            toast.info(
              `${data.duplicateJournalfoerteDokumenter.length} av dokumentene er allerede lagt til som vedlegg.`,
            );
          }
        } catch (e) {
          const message = 'Kunne ikke endre hoveddokument.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
          documentsPatchResult.undo();
          smartEditorsPatchResult.undo();
          smartEditorPatchResult.undo();
        }
      },
    }),
    finishDocument: builder.mutation<IMainDocument, IFinishDocumentParams>({
      query: ({ oppgaveId, dokumentId, ...body }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/ferdigstill`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ dokumentId, oppgaveId }, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
            draft.map((doc) => {
              if (doc.id === dokumentId) {
                return { ...doc, isMarkertAvsluttet: true };
              }

              return doc;
            }),
          ),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
              draft.map((doc) => (doc.id === data.id ? data : doc)),
            ),
          );

          dispatch(smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { oppgaveId, dokumentId }, () => null));

          dispatch(
            smartEditorQuerySlice.util.updateQueryData('getSmartEditors', { oppgaveId }, (draft) =>
              draft.filter(({ id }) => id !== dokumentId),
            ),
          );
        } catch (e) {
          patch.undo();

          const message = 'Kunne ikke ferdigstille dokumentet.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    deleteDocument: builder.mutation<void, IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ dokumentId, oppgaveId }, { dispatch, queryFulfilled }) => {
        const documentsPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData(
            'getDocuments',
            oppgaveId,
            (draft) => draft.filter(({ id, parentId }) => id !== dokumentId || parentId === dokumentId), // Remove deleted document from list.
          ),
        );

        const smartEditorPatchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { oppgaveId, dokumentId }, () => null),
        );

        const smartEditorsPatchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData(
            'getSmartEditors',
            { oppgaveId },
            (draft) => draft.filter(({ id, parentId }) => id !== dokumentId || parentId === dokumentId), // Remove deleted document from list.
          ),
        );

        try {
          await queryFulfilled;
        } catch (e) {
          documentsPatchResult.undo();
          smartEditorPatchResult.undo();
          smartEditorsPatchResult.undo();

          const message = 'Kunne ikke slette dokumentet.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    uploadFileDocument: builder.mutation<IFileDocument, ICreateFileDocumentParams>({
      query: ({ oppgaveId, file, dokumentTypeId }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('dokumentTypeId', dokumentTypeId);

        return {
          url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/fil`,
          method: 'POST',
          body: formData,
        };
      },
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => [data, ...draft]));
        } catch (e) {
          const message = 'Kunne ikke laste opp dokument.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    createVedleggFromJournalfoertDocument: builder.mutation<
      ICreateVedleggFromJournalfoertDocumentResponse,
      ICreateVedleggFromJournalfoertDocumentParams
    >({
      query: ({ oppgaveId, parentId, journalfoerteDokumenter }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/journalfoertedokumenter`,
        method: 'POST',
        body: {
          parentId,
          journalfoerteDokumenter: journalfoerteDokumenter.map(({ journalpostId, dokumentInfoId }) => ({
            journalpostId,
            dokumentInfoId,
          })),
        },
      }),
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => [
              ...draft,
              ...data.addedJournalfoerteDokumenter,
            ]),
            // for (const newDoc of data.addedJournalfoerteDokumenter) {
            // for (let index = draft.length - 1; index >= 0; index--) {
            //   const oldDoc = draft[index];

            //   if (
            //     oldDoc !== undefined &&
            //     oldDoc.type === DocumentTypeEnum.JOURNALFOERT &&
            //     oldDoc.journalfoertDokumentReference.journalpostId ===
            //       newDoc.journalfoertDokumentReference.journalpostId &&
            //     oldDoc.journalfoertDokumentReference.dokumentInfoId ===
            //       newDoc.journalfoertDokumentReference.dokumentInfoId
            //   ) {
            //     draft[index] = newDoc;
            //     break;
            //   }
            // }
            // }
          );

          if (data.duplicateJournalfoerteDokumenter.length !== 0) {
            toast.info(
              `${data.duplicateJournalfoerteDokumenter.length} av dokumentene er allerede lagt til som vedlegg.`,
            );
          }
        } catch (e) {
          const message = 'Kunne ikke sette journalpost(er) som vedlegg.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
  }),
});

const optimisticUpdate = <K extends keyof ISmartEditor & keyof IMainDocument>(
  oppgaveId: string,
  dokumentId: string,
  key: K,
  value: (ISmartEditor & IMainDocument)[K],
) => {
  const documentsPatchResult = reduxStore.dispatch(
    documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
      draft.map((doc) => (doc.id === dokumentId ? { ...doc, [key]: value } : doc)),
    ),
  );

  const smartEditorsPatchResult = reduxStore.dispatch(
    smartEditorQuerySlice.util.updateQueryData('getSmartEditors', { oppgaveId }, (draft) =>
      draft.map((doc) => (doc.id === dokumentId ? { ...doc, [key]: value } : doc)),
    ),
  );

  const smartEditorPatchResult = reduxStore.dispatch(
    smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { oppgaveId, dokumentId }, (draft) => {
      if (draft !== null) {
        return { ...draft, [key]: value };
      }

      return draft;
    }),
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
  useCreateVedleggFromJournalfoertDocumentMutation,
} = documentsMutationSlice;
