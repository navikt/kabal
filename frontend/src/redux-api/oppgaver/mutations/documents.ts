/* eslint-disable max-depth */
/* eslint-disable max-lines */
import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { reduxStore } from '@app/redux/configure-store';
import { IArkivertDocument, IArkivertDocumentVedlegg, Journalposttype } from '@app/types/arkiverte-documents';
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
import {
  ICreateVedleggFromJournalfoertDocumentResponse,
  IModifiedDocumentResponse,
  ISetParentResponse,
} from '@app/types/documents/response';
import { isApiRejectionError } from '@app/types/errors';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { documentsQuerySlice } from '../queries/documents';

const documentsMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
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
        }
      },
    }),
    finishDocument: builder.mutation<IModifiedDocumentResponse, IFinishDocumentParams>({
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
              draft.map((doc) => (doc.id === dokumentId ? { ...doc, ...data } : doc)),
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
    uploadFileDocument: builder.mutation<IFileDocument, ICreateFileDocumentParams>({
      query: ({ oppgaveId, file, dokumentTypeId, parentId }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('dokumentTypeId', dokumentTypeId);

        if (typeof parentId === 'string') {
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
      onQueryStarted: async (
        { oppgaveId, parentId, journalfoerteDokumenter, creator, isFinished },
        { dispatch, queryFulfilled },
      ) => {
        const getDocumentsPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => {
            const addedDocuments: IMainDocument[] = draft;

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
                id: crypto.randomUUID(),
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
                  harTilgangTilArkivvariant: doc.harTilgangTilArkivvariant,
                  datoOpprettet: doc.datoOpprettet,
                  sortKey: doc.sortKey,
                },
                creator,
              });
            }

            const sorted = addedDocuments.sort((a, b) => {
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

            return sorted;
          }),
        );

        const getArkiverteDokumenterPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getArkiverteDokumenter', oppgaveId, (draft) => {
            if (isFinished) {
              return draft;
            }

            const { length: dokumenterCount } = draft.dokumenter;
            const dokumenter = new Array<IArkivertDocument>(dokumenterCount);

            for (let i = dokumenterCount - 1; i >= 0; i--) {
              const doc = draft.dokumenter[i]!;
              const journalpostDocuments = journalfoerteDokumenter.filter((j) => j.journalpostId === doc.journalpostId);

              if (journalpostDocuments.length === 0) {
                dokumenter[i] = doc;
                continue;
              }

              const { length: vedleggCount } = doc.vedlegg;
              const vedlegg = new Array<IArkivertDocumentVedlegg>(vedleggCount);

              for (let ii = vedleggCount - 1; ii >= 0; ii--) {
                const v = doc.vedlegg[ii]!;
                const vedleggInList =
                  v.valgt || journalpostDocuments.some((j) => j.dokumentInfoId === v.dokumentInfoId);
                vedlegg[ii] = vedleggInList ? { ...v, valgt: true } : v;
              }

              dokumenter[i] = {
                ...doc,
                valgt: doc.valgt || journalpostDocuments.some((j) => j.dokumentInfoId === doc.dokumentInfoId),
                vedlegg,
              };
            }

            return { ...draft, dokumenter };
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
                    oldDoc.type === DocumentTypeEnum.JOURNALFOERT &&
                    oldDoc.journalfoertDokumentReference.journalpostId ===
                      newDoc.journalfoertDokumentReference.journalpostId &&
                    oldDoc.journalfoertDokumentReference.dokumentInfoId ===
                      newDoc.journalfoertDokumentReference.dokumentInfoId &&
                    oldDoc.parentId === newDoc.parentId &&
                    oldDoc.id !== newDoc.id
                  ) {
                    draft[index] = newDoc;
                    break;
                  }
                }
              }

              return draft;
            }),
          );

          if (data.duplicateJournalfoerteDokumenter.length !== 0) {
            toast.info(
              `${data.duplicateJournalfoerteDokumenter.length} av dokumentene er allerede lagt til som vedlegg.`,
            );
          }
        } catch (e) {
          getDocumentsPatchResult.undo();
          getArkiverteDokumenterPatchResult.undo();

          const message = 'Kunne ikke sette journalpost(er) som vedlegg.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    setDatoMottatt: builder.mutation<IMainDocument, { oppgaveId: string; dokumentId: string; datoMottatt: string }>({
      query: ({ oppgaveId, dokumentId, datoMottatt }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/datomottatt`,
        body: { datoMottatt },
        method: 'PUT',
      }),
      onQueryStarted: async ({ dokumentId, datoMottatt, oppgaveId }, { queryFulfilled }) => {
        const patchResult = reduxStore.dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
            draft.map((doc) =>
              doc.id === dokumentId &&
              doc.type === DocumentTypeEnum.UPLOADED &&
              doc.dokumentTypeId === DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN
                ? { ...doc, datoMottatt }
                : doc,
            ),
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          toast.error('Kunne ikke endre dato mottatt.');
        }
      },
    }),
  }),
});

const optimisticUpdate = <K extends keyof IMainDocument>(
  oppgaveId: string,
  dokumentId: string,
  key: K,
  value: IMainDocument[K],
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
  useDeleteDocumentMutation,
  useFinishDocumentMutation,
  useSetTitleMutation,
  useSetTypeMutation,
  useUploadFileDocumentMutation,
  useSetParentMutation,
  useCreateVedleggFromJournalfoertDocumentMutation,
  useSetDatoMottattMutation,
} = documentsMutationSlice;
