import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { areJournalfoertDocumentsEqual } from '@app/domain/journalfoerte-documents';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { reduxStore } from '@app/redux/configure-store';
import { Journalposttype } from '@app/types/arkiverte-documents';
import type { IDocumentParams } from '@app/types/documents/common-params';
import {
  DistribusjonsType,
  DocumentTypeEnum,
  type IDocument,
  type IFileDocument,
  type InngaaendeKanal,
} from '@app/types/documents/documents';
import {
  type ICreateFileDocumentParams,
  type ICreateVedleggParams,
  type IFinishDocumentParams,
  type ISetMottakerListParams,
  type ISetNameParams,
  type ISetParentParams,
  type ISetTypeParams,
  mottakerToInputMottaker,
} from '@app/types/documents/params';
import type {
  ICreateVedleggResponse,
  IModifiedDocumentResponse,
  ISetParentResponse,
} from '@app/types/documents/response';
import { isApiRejectionError } from '@app/types/errors';
import type { IdentifikatorPart } from '@app/types/oppgave-common';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { documentsQuerySlice } from '../queries/documents';

const documentsMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    setMottakerList: builder.mutation<IModifiedDocumentResponse, ISetMottakerListParams>({
      query: ({ oppgaveId, dokumentId, mottakerList }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/mottakere`,
        body: { mottakerList: mottakerList.map(mottakerToInputMottaker) },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, mottakerList, oppgaveId }, { queryFulfilled }) => {
        const undo = optimisticUpdate(oppgaveId, dokumentId, 'mottakerList', mottakerList);

        try {
          const { data } = await queryFulfilled;
          optimisticUpdate(oppgaveId, dokumentId, 'modified', data.modified);
        } catch {
          undo();
          toast.error('Kunne ikke endre mottakere.');
        }
      },
    }),
    setType: builder.mutation<IModifiedDocumentResponse, ISetTypeParams>({
      query: ({ oppgaveId, dokumentId, dokumentTypeId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/dokumenttype`,
        body: { dokumentTypeId },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, dokumentTypeId, oppgaveId }, { queryFulfilled }) => {
        const undo = optimisticUpdate(oppgaveId, dokumentId, 'dokumentTypeId', dokumentTypeId);

        try {
          const { data } = await queryFulfilled;
          optimisticUpdate(oppgaveId, dokumentId, 'modified', data.modified);
        } catch {
          undo();
          toast.error('Kunne ikke endre dokumenttype.');
        }
      },
    }),
    setTitle: builder.mutation<IModifiedDocumentResponse, ISetNameParams>({
      query: ({ oppgaveId, dokumentId, title }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/tittel`,
        body: { title },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, title, oppgaveId }, { queryFulfilled }) => {
        const undo = optimisticUpdate(oppgaveId, dokumentId, 'tittel', title);

        try {
          const { data } = await queryFulfilled;
          optimisticUpdate(oppgaveId, dokumentId, 'modified', data.modified);
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
          // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => {
            const newDocuments: IDocument[] = [];

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

                // Just to satisfy the TypeScript type system.
                if (parentId === null) {
                  newDocuments.push({ ...existing, parentId: null });
                } else {
                  newDocuments.push({ ...existing, parentId });
                }
                continue;
              }

              newDocuments.push(existing);
            }

            return newDocuments;
          }),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => {
              const newDocuments: IDocument[] = [];

              for (const oldDoc of draft) {
                let altered = false;

                // If document is altered, add it to the new list.
                for (const alteredDoc of data.alteredDocuments) {
                  if (oldDoc.id === alteredDoc.id) {
                    altered = true;
                    newDocuments.push({ ...oldDoc, parentId: alteredDoc.parentId, modified: alteredDoc.modified });
                    break;
                  }
                }

                // If it is altered, continue to next document.
                if (altered) {
                  continue;
                }

                // If it is not altered, check if it is a duplicate.
                const isDuplicate = data.duplicateJournalfoerteDokumenter.includes(oldDoc.id);

                // If it is a duplicate, continue to next document.
                if (isDuplicate) {
                  continue;
                }

                newDocuments.push(oldDoc);
              }

              return newDocuments;
            }),
          );

          if (data.duplicateJournalfoerteDokumenter.length > 0) {
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
        }
      },
    }),
    finishDocument: builder.mutation<IModifiedDocumentResponse, IFinishDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/ferdigstill`,
        method: 'POST',
      }),
      onQueryStarted: async ({ dokumentId, oppgaveId }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
              draft.map((doc) => (doc.id === dokumentId ? { ...doc, ...data } : doc)),
            ),
          );

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocument', { oppgaveId, dokumentId }, (draft) => ({
              ...draft,
              ...data,
            })),
          );
        } catch (e) {
          const message = 'Kunne ikke ferdigstille dokumentet.';

          // API error is shown in modal
          if (!isApiRejectionError(e)) {
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
            (draft) => draft.filter(({ id, parentId }) => id !== dokumentId && parentId !== dokumentId), // Remove deleted document from list.
          ),
        );

        const smartEditorPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getDocument', { oppgaveId, dokumentId }, () => undefined),
        );

        const smartEditorsPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData(
            'getDocuments',
            oppgaveId,
            (draft) => draft.filter(({ id, parentId }) => id !== dokumentId && parentId !== dokumentId), // Remove deleted document from list.
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
    uploadFileDocument: builder.mutation<IFileDocument<null> | IFileDocument<string>, ICreateFileDocumentParams>({
      query: ({ oppgaveId, file, dokumentTypeId, parentId }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('dokumentTypeId', dokumentTypeId);

        if (parentId !== undefined) {
          formData.append('parentId', parentId);
        }

        return {
          url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/fil`,
          method: 'POST',
          body: formData,
        };
      },
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
              draft.some((d) => d.id === data.id) ? draft : [data, ...draft],
            ),
          );
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
    createVedleggFromJournalfoertDocument: builder.mutation<ICreateVedleggResponse, ICreateVedleggParams>({
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
      onQueryStarted: async (
        { oppgaveId, parentId, journalfoerteDokumenter, creator },
        { dispatch, queryFulfilled },
      ) => {
        const getDocumentsPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => {
            const addedDocuments: IDocument[] = draft;

            for (const doc of journalfoerteDokumenter) {
              if (
                draft.some(
                  (d) =>
                    d.type === DocumentTypeEnum.JOURNALFOERT &&
                    d.parentId === parentId &&
                    d.journalfoertDokumentReference?.journalpostId === doc.journalpostId &&
                    d.journalfoertDokumentReference?.dokumentInfoId === doc.dokumentInfoId,
                )
              ) {
                continue;
              }

              addedDocuments.push({
                ...doc,
                id: `optimistic-${crypto.randomUUID()}`,
                parentId,
                isMarkertAvsluttet: false,
                isSmartDokument: false,
                dokumentTypeId:
                  doc.journalposttype === Journalposttype.NOTAT ? DistribusjonsType.NOTAT : DistribusjonsType.BREV,
                created: doc.datoOpprettet,
                modified: doc.datoOpprettet,
                tittel: doc.tittel ?? 'Ukjent',
                type: DocumentTypeEnum.JOURNALFOERT,
                journalfoertDokumentReference: {
                  journalpostId: doc.journalpostId,
                  dokumentInfoId: doc.dokumentInfoId,
                  hasAccess: doc.hasAccess,
                  datoOpprettet: doc.datoOpprettet,
                  varianter: doc.varianter,
                  sortKey: doc.sortKey,
                },
                creator,
                mottakerList: [],
              });
            }

            return addedDocuments.sort((a, b) => {
              if (a.type === DocumentTypeEnum.JOURNALFOERT) {
                if (b.type === DocumentTypeEnum.JOURNALFOERT) {
                  return b.journalfoertDokumentReference.sortKey.localeCompare(a.journalfoertDokumentReference.sortKey);
                }

                return 1;
              }

              if (b.type === DocumentTypeEnum.JOURNALFOERT) {
                return -1;
              }

              return b.created.localeCompare(a.created);
            });
          }),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => {
              for (const newDoc of data.addedJournalfoerteDokumenter) {
                for (let index = draft.length - 1; index >= 0; index--) {
                  const oldDoc = draft[index];

                  if (oldDoc === undefined) {
                    continue;
                  }

                  if (
                    areJournalfoertDocumentsEqual(oldDoc, newDoc) &&
                    oldDoc.id !== newDoc.id &&
                    oldDoc.id.startsWith('optimistic-')
                  ) {
                    draft[index] = newDoc;
                    break;
                  }
                }
              }

              return draft;
            }),
          );

          if (data.duplicateJournalfoerteDokumenter.length > 0) {
            toast.info(
              `${data.duplicateJournalfoerteDokumenter.length} av dokumentene er allerede lagt til som vedlegg.`,
            );
          }
        } catch (e) {
          getDocumentsPatchResult.undo();

          const message = 'Kunne ikke sette journalpost(er) som vedlegg.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    setDatoMottatt: builder.mutation<IDocument, { oppgaveId: string; dokumentId: string; datoMottatt: string }>({
      query: ({ oppgaveId, dokumentId, datoMottatt }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/datomottatt`,
        body: { datoMottatt },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, datoMottatt, oppgaveId }, { queryFulfilled }) => {
        const collectionPatchResult = reduxStore.dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
            draft.map((doc) =>
              doc.id === dokumentId &&
              doc.type === DocumentTypeEnum.UPLOADED &&
              getIsIncomingDocument(doc.dokumentTypeId)
                ? { ...doc, datoMottatt }
                : doc,
            ),
          ),
        );

        const documentPatchResult = reduxStore.dispatch(
          documentsQuerySlice.util.updateQueryData('getDocument', { oppgaveId, dokumentId }, (draft) => {
            if (
              draft !== null &&
              draft.type === DocumentTypeEnum.UPLOADED &&
              getIsIncomingDocument(draft.dokumentTypeId)
            ) {
              draft.datoMottatt = datoMottatt;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          collectionPatchResult.undo();
          documentPatchResult.undo();
          toast.error('Kunne ikke endre dato mottatt.');
        }
      },
    }),
    setInngaaendeKanal: builder.mutation<
      void,
      { oppgaveId: string; dokumentId: string; inngaaendeKanal: InngaaendeKanal }
    >({
      query: ({ oppgaveId, dokumentId, inngaaendeKanal }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/inngaaendekanal`,
        body: { kanal: inngaaendeKanal },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, inngaaendeKanal, oppgaveId }, { queryFulfilled }) => {
        const collectionPatchResult = reduxStore.dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
            draft.map((doc) =>
              doc.id === dokumentId && doc.type === DocumentTypeEnum.UPLOADED ? { ...doc, inngaaendeKanal } : doc,
            ),
          ),
        );

        const documentPatchResult = reduxStore.dispatch(
          documentsQuerySlice.util.updateQueryData('getDocument', { oppgaveId, dokumentId }, (draft) => {
            if (draft.type === DocumentTypeEnum.UPLOADED) {
              draft.inngaaendeKanal = inngaaendeKanal;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          collectionPatchResult.undo();
          documentPatchResult.undo();
          toast.error('Kunne ikke endre inngående kanal.');
        }
      },
    }),
    setAvsender: builder.mutation<void, { oppgaveId: string; dokumentId: string; avsender: IdentifikatorPart }>({
      query: ({ oppgaveId, dokumentId, avsender }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/avsender`,
        body: { identifikator: avsender.identifikator },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, avsender, oppgaveId }, { queryFulfilled }) => {
        const collectionPatchResult = reduxStore.dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
            draft.map((doc) =>
              doc.id === dokumentId && doc.type === DocumentTypeEnum.UPLOADED ? { ...doc, avsender } : doc,
            ),
          ),
        );

        const documentPatchResult = reduxStore.dispatch(
          documentsQuerySlice.util.updateQueryData('getDocument', { oppgaveId, dokumentId }, (draft) => {
            if (draft.type === DocumentTypeEnum.UPLOADED) {
              draft.avsender = avsender;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          collectionPatchResult.undo();
          documentPatchResult.undo();
          toast.error('Kunne ikke endre avsender.');
        }
      },
    }),
  }),
});

const optimisticUpdate = <K extends keyof IDocument>(
  oppgaveId: string,
  dokumentId: string,
  key: K,
  value: IDocument[K],
) => {
  const documentsPatchResult = reduxStore.dispatch(
    documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
      draft.map((doc) => (doc.id === dokumentId ? { ...doc, [key]: value } : doc)),
    ),
  );

  const smartEditorPatchResult = reduxStore.dispatch(
    documentsQuerySlice.util.updateQueryData('getDocument', { oppgaveId, dokumentId }, (draft) => {
      if (draft !== null) {
        return { ...draft, [key]: value };
      }

      return draft;
    }),
  );

  return () => {
    documentsPatchResult.undo();
    smartEditorPatchResult.undo();
  };
};

export const {
  useSetMottakerListMutation,
  useDeleteDocumentMutation,
  useFinishDocumentMutation,
  useSetTitleMutation,
  useSetTypeMutation,
  useUploadFileDocumentMutation,
  useSetParentMutation,
  useCreateVedleggFromJournalfoertDocumentMutation,
  useSetDatoMottattMutation,
  useSetInngaaendeKanalMutation,
  useSetAvsenderMutation,
} = documentsMutationSlice;
