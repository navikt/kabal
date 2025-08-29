import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import type { IDocumentParams } from '@app/types/documents/common-params';
import { isApiRejectionError } from '@app/types/errors';
import type {
  IDeleteCommentOrReplyParams,
  IPatchCommentOrReplyParams,
  IPostCommentParams,
  IPostReplyParams,
  ISmartEditorComment,
} from '@app/types/smart-editor/comments';
import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_BEHANDLINGER_BASE_QUERY } from './common';

export const smartEditorCommentsApi = createApi({
  reducerPath: 'smartEditorCommentsApi',
  baseQuery: KABAL_BEHANDLINGER_BASE_QUERY,
  endpoints: (builder) => ({
    getComments: builder.query<ISmartEditorComment[], IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => `${oppgaveId}/smartdokumenter/${dokumentId}/comments`,
    }),
    postComment: builder.mutation<ISmartEditorComment, IPostCommentParams>({
      query: ({ oppgaveId, dokumentId, ...body }) => ({
        url: `${oppgaveId}/smartdokumenter/${dokumentId}/comments`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ oppgaveId, dokumentId }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          const { updateQueryData } = smartEditorCommentsApi.util;
          dispatch(updateQueryData('getComments', { oppgaveId, dokumentId }, (draft) => [...draft, data]));
        } catch (error) {
          const heading = 'Kunne ikke legge til kommentar';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
    deleteCommentOrThread: builder.mutation<void, IDeleteCommentOrReplyParams>({
      query: ({ oppgaveId, dokumentId, commentId }) => ({
        url: `${oppgaveId}/smartdokumenter/${dokumentId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ oppgaveId, dokumentId, commentId }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            smartEditorCommentsApi.util.updateQueryData('getComments', { oppgaveId, dokumentId }, (draft) =>
              draft
                .filter((thread) => thread.id !== commentId)
                .map((thread) => ({ ...thread, comments: thread.comments.filter((c) => c.id !== commentId) })),
            ),
          );
        } catch (error) {
          const heading = 'Kunne ikke slette kommentar';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
    postReply: builder.mutation<ISmartEditorComment, IPostReplyParams>({
      query: ({ oppgaveId, dokumentId, commentId, ...body }) => ({
        url: `${oppgaveId}/smartdokumenter/${dokumentId}/comments/${commentId}/replies`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ oppgaveId, dokumentId, commentId }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            smartEditorCommentsApi.util.updateQueryData('getComments', { oppgaveId, dokumentId }, (draft) =>
              draft.map((thread) =>
                thread.id === commentId
                  ? {
                      ...thread,
                      comments: thread.comments.some((r) => r.id === data.id)
                        ? thread.comments
                        : [...thread.comments, data],
                    }
                  : thread,
              ),
            ),
          );
        } catch (error) {
          const heading = 'Kunne ikke sende svar';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
    updateCommentOrReply: builder.mutation<ISmartEditorComment, IPatchCommentOrReplyParams>({
      query: ({ oppgaveId, dokumentId, commentId, ...body }) => ({
        url: `${oppgaveId}/smartdokumenter/${dokumentId}/comments/${commentId}`,
        method: 'PATCH',
        body,
      }),
      onQueryStarted: async ({ oppgaveId, dokumentId, commentId, text }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          smartEditorCommentsApi.util.updateQueryData('getComments', { oppgaveId, dokumentId }, (draft) =>
            draft.map((t) =>
              t.id === commentId
                ? { ...t, text }
                : { ...t, comments: t.comments.map((c) => (c.id === commentId ? { ...c, text } : c)) },
            ),
          ),
        );

        try {
          await queryFulfilled;

          const { data } = await queryFulfilled;

          dispatch(
            smartEditorCommentsApi.util.updateQueryData('getComments', { oppgaveId, dokumentId }, (draft) =>
              draft.map((t) =>
                t.id === commentId
                  ? { ...t, ...data }
                  : { ...t, comments: t.comments.map((c) => (c.id === commentId ? { ...c, ...data } : c)) },
              ),
            ),
          );
        } catch (error) {
          patchResult.undo();

          const heading = 'Kunne ikke endre melding';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
  }),
});

export const {
  useGetCommentsQuery,
  usePostCommentMutation,
  usePostReplyMutation,
  useDeleteCommentOrThreadMutation,
  useUpdateCommentOrReplyMutation,
} = smartEditorCommentsApi;
