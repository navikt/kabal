import { createApi } from '@reduxjs/toolkit/query/react';
import { IDocumentParams } from '@app/types/documents/common-params';
import {
  IDeleteCommentOrReplyParams,
  IPatchCommentOrReplyParams,
  IPostCommentParams,
  IPostReplyParams,
  ISmartEditorComment,
} from '@app/types/smart-editor/comments';
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
        const { data } = await queryFulfilled;

        dispatch(
          smartEditorCommentsApi.util.updateQueryData('getComments', { oppgaveId, dokumentId }, (draft) =>
            draft.some((c) => c.id === data.id) ? draft : [...draft, data],
          ),
        );
      },
    }),
    deleteCommentOrThread: builder.mutation<void, IDeleteCommentOrReplyParams>({
      query: ({ oppgaveId, dokumentId, commentId }) => ({
        url: `${oppgaveId}/smartdokumenter/${dokumentId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ oppgaveId, dokumentId, commentId }, { dispatch, queryFulfilled }) => {
        await queryFulfilled;

        dispatch(
          smartEditorCommentsApi.util.updateQueryData('getComments', { oppgaveId, dokumentId }, (draft) =>
            draft
              .filter((thread) => thread.id !== commentId)
              .map((thread) => ({ ...thread, comments: thread.comments.filter((c) => c.id !== commentId) })),
          ),
        );
      },
    }),
    postReply: builder.mutation<ISmartEditorComment, IPostReplyParams>({
      query: ({ oppgaveId, dokumentId, commentId, ...body }) => ({
        url: `${oppgaveId}/smartdokumenter/${dokumentId}/comments/${commentId}/replies`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ oppgaveId, dokumentId, commentId }, { dispatch, queryFulfilled }) => {
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
      },
    }),
    updateCommentOrReply: builder.mutation<ISmartEditorComment, IPatchCommentOrReplyParams>({
      query: ({ oppgaveId, dokumentId, commentId, ...body }) => ({
        url: `${oppgaveId}/smartdokumenter/${dokumentId}/comments/${commentId}`,
        method: 'PATCH',
        body,
      }),
      onQueryStarted: async ({ oppgaveId, dokumentId, commentId }, { dispatch, queryFulfilled }) => {
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
