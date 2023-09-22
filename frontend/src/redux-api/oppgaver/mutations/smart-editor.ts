import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { isApiRejectionError } from '@app/types/errors';
import { ICreateSmartDocumentParams, IUpdateSmartDocumentParams } from '@app/types/smart-editor/params';
import { ISmartEditor } from '@app/types/smart-editor/smart-editor';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { documentsQuerySlice } from '../queries/documents';
import { smartEditorQuerySlice } from '../queries/smart-editor';

const smartEditorMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    createSmartDocument: builder.mutation<ISmartEditor, ICreateSmartDocumentParams>({
      query: ({ oppgaveId, content, dokumentTypeId, templateId, tittel, parentId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter`,
        method: 'POST',
        body: { content, dokumentTypeId, templateId, tittel, parentId },
      }),
      onQueryStarted: async ({ oppgaveId, creatorIdent, creatorRole }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => [
              {
                id: data.id,
                dokumentTypeId: data.dokumentTypeId,
                isMarkertAvsluttet: false,
                isSmartDokument: true,
                created: data.created,
                modified: data.modified,
                parentId: data.parentId,
                templateId: data.templateId,
                tittel: data.tittel,
                type: DocumentTypeEnum.SMART,
                creatorIdent,
                creatorRole,
              },
              ...draft,
            ]),
          );
          dispatch(
            smartEditorQuerySlice.util.updateQueryData('getSmartEditors', { oppgaveId }, (draft) => [...draft, data]),
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

    updateSmartEditor: builder.mutation<ISmartEditor, IUpdateSmartDocumentParams>({
      query: ({ oppgaveId, dokumentId, ...body }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter/${dokumentId}`,
        method: 'PATCH',
        body,
        timeout: 10000,
      }),
      onQueryStarted: async ({ dokumentId, oppgaveId, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { dokumentId, oppgaveId }, (draft) => {
            if (draft !== null) {
              return {
                ...draft,
                ...update,
              };
            }
          }),
        );

        const listPatchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditors', { oppgaveId }, (draft) =>
            draft.map((e) => (e.id === dokumentId ? { ...e, ...update } : e)),
          ),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { dokumentId, oppgaveId }, (draft) => {
              if (draft !== null) {
                return {
                  ...draft,
                  ...data,
                };
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

export const { useCreateSmartDocumentMutation, useUpdateSmartEditorMutation } = smartEditorMutationSlice;
