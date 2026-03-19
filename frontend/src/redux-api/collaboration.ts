import { createApi } from '@reduxjs/toolkit/query/react';
import { PROXY_BASE_QUERY } from '@/redux-api/common';
import { documentsQuerySlice } from '@/redux-api/oppgaver/queries/documents';
import type { ISmartDocumentOrAttachment } from '@/types/documents/documents';
import type { ICreateSmartDocumentParams } from '@/types/smart-editor/params';

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
        const { data } = await queryFulfilled;

        dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
            draft.some((e) => e.id === data.id) ? draft : [data, ...draft],
          ),
        );

        dispatch(documentsQuerySlice.util.upsertQueryData('getDocument', { dokumentId: data.id, oppgaveId }, data));
      },
    }),
  }),
});

export const { useCreateSmartDocumentMutation } = collaborationApi;
