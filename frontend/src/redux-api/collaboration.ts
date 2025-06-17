import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { PROXY_BASE_QUERY } from '@app/redux-api/common';
import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import { isApiRejectionError } from '@app/types/errors';
import type { ICreateSmartDocumentParams } from '@app/types/smart-editor/params';
import { createApi } from '@reduxjs/toolkit/query/react';

export const collaborationApi = createApi({
  reducerPath: 'collaborationApi',
  baseQuery: PROXY_BASE_QUERY,
  endpoints: (builder) => ({
    createSmartDocument: builder.mutation<ISmartDocumentOrAttachment, ICreateSmartDocumentParams>({
      query: ({ oppgaveId, ...body }) => ({
        url: `/collaboration/behandlinger/${oppgaveId}/dokumenter`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
              draft.some((e) => e.id === data.id) ? draft : [data, ...draft],
            ),
          );

          dispatch(documentsQuerySlice.util.upsertQueryData('getDocument', { dokumentId: data.id, oppgaveId }, data));
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
  }),
});

export const { useCreateSmartDocumentMutation } = collaborationApi;
