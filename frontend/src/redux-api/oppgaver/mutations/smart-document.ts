import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { ISmartDocument } from '@app/types/documents/documents';
import { isApiRejectionError } from '@app/types/errors';
import { ICreateSmartDocumentParams, IUpdateSmartDocumentParams } from '@app/types/smart-editor/params';
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

    updateSmartDocument: builder.mutation<ISmartDocument, IUpdateSmartDocumentParams>({
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

        try {
          const { data } = await queryFulfilled;
          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocument', { dokumentId, oppgaveId }, (draft) => {
              if (draft !== null && draft.isSmartDokument) {
                return { ...draft, modified: data.modified };
              }

              return data;
            }),
          );
        } catch (e: unknown) {
          patchResult.undo();
          listPatchResult.undo();

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
