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
      onQueryStarted: async ({ dokumentId, oppgaveId, content }, { dispatch, queryFulfilled }) => {
        try {
          const { navIdent, navn } = await user;
          const { data } = await queryFulfilled;
          const { modified, version } = data;

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocument', { dokumentId, oppgaveId }, (draft) => {
              if (draft !== null && draft.isSmartDokument) {
                return { ...draft, content, modified, version };
              }
            }),
          );

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
              draft.map((d) => (d.isSmartDokument && d.id === dokumentId ? { ...d, modified, version, content } : d)),
            ),
          );

          dispatch(
            documentsQuerySlice.util.updateQueryData(
              'getSmartDocumentVersion',
              { dokumentId, oppgaveId, versionId: version },
              () => content,
            ),
          );

          dispatch(
            documentsQuerySlice.util.updateQueryData('getSmartDocumentVersions', { dokumentId, oppgaveId }, (draft) => [
              {
                version,
                timestamp: modified,
                author: { navIdent, navn },
              },
              ...draft,
            ]),
          );
        } catch (e: unknown) {
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
