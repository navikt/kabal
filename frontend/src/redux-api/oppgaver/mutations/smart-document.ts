import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { ISmartDocument } from '@app/types/documents/documents';
import { IModifiedSmartDocumentResponse } from '@app/types/documents/response';
import { isApiRejectionError } from '@app/types/errors';
import { ICreateSmartDocumentParams, IUpdateSmartDocumentParams } from '@app/types/smart-editor/params';
import { user } from '@app/user';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { documentsQuerySlice } from '../queries/documents';

const smartDocumentsMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    createSmartDocument: builder.mutation<ISmartDocument, ICreateSmartDocumentParams>({
      query: ({ oppgaveId, content, dokumentTypeId, templateId, tittel, parentId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter`,
        method: 'POST',
        body: { content, dokumentTypeId, templateId, tittel, parentId },
      }),
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
              draft.some((e) => e.id === data.id) ? draft : [data, ...draft],
            ),
          );

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocument', { dokumentId: data.id, oppgaveId }, () => data),
          );
        } catch (e) {
          const message = 'Kunne ikke opprette dokument.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),

    updateSmartDocument: builder.mutation<IModifiedSmartDocumentResponse, IUpdateSmartDocumentParams>({
      query: ({ oppgaveId, dokumentId, ...body }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter/${dokumentId}`,
        method: 'PATCH',
        body,
        timeout: 10_000,
      }),
      onQueryStarted: async ({ dokumentId, oppgaveId, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getDocument', { dokumentId, oppgaveId }, (draft) => {
            if (draft !== null && draft.isSmartDokument) {
              return { ...draft, ...update, version: draft.version + 1 };
            }
          }),
        );

        const listPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
            draft.map((e) =>
              e.isSmartDokument && e.id === dokumentId ? { ...e, ...update, version: e.version + 1 } : e,
            ),
          ),
        );

        const versionId = update.version + 1;
        const { navIdent, navn } = await user;

        const versionsPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getSmartDocumentVersions', { dokumentId, oppgaveId }, (draft) => [
            { version: versionId, timestamp: new Date().toISOString(), author: { navIdent, navn } },
            ...draft,
          ]),
        );

        const versionPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData(
            'getSmartDocumentVersion',
            { dokumentId, oppgaveId, versionId },
            () => update.content,
          ),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
              draft.map((e) => (e.id === dokumentId ? { ...e, modified: data.modified } : e)),
            ),
          );

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocument', { dokumentId, oppgaveId }, (draft) => {
              draft.modified = data.modified;
            }),
          );

          dispatch(
            documentsQuerySlice.util.updateQueryData('getSmartDocumentVersions', { dokumentId, oppgaveId }, (draft) =>
              draft.map((e) => (e.version === versionId ? { ...e, timestamp: data.modified } : e)),
            ),
          );
        } catch (e: unknown) {
          patchResult.undo();
          listPatchResult.undo();
          versionsPatchResult.undo();
          versionPatchResult.undo();

          const message = 'Feil ved lagring av dokument.';

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

export const { useCreateSmartDocumentMutation, useUpdateSmartDocumentMutation } = smartDocumentsMutationSlice;
