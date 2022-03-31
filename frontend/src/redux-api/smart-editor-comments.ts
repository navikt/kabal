import { createApi } from '@reduxjs/toolkit/query/react';
import { IDocumentParams } from '../types/documents-common-params';
import {
  IGetCommentParams,
  IPostCommentParams,
  IPostReplyParams,
  ISmartEditorComment,
} from '../types/smart-editor-comments';
import { KABAL_BEHANDLINGER_BASE_QUERY } from './common';

export const smartEditorCommentsApi = createApi({
  reducerPath: 'smartEditorCommentsApi',
  baseQuery: KABAL_BEHANDLINGER_BASE_QUERY,
  endpoints: (builder) => ({
    getComments: builder.query<ISmartEditorComment[], IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => `${oppgaveId}/dokumenter/smarteditor/${dokumentId}/comments`,
    }),
    getComment: builder.query<ISmartEditorComment, IGetCommentParams>({
      query: ({ oppgaveId, dokumentId, commentId }) =>
        `${oppgaveId}/dokumenter/smarteditor/${dokumentId}/comments/${commentId}`,
    }),
    postComment: builder.mutation<ISmartEditorComment, IPostCommentParams>({
      query: ({ oppgaveId, dokumentId, ...body }) => ({
        url: `${oppgaveId}/dokumenter/smarteditor/${dokumentId}/comments`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ oppgaveId, dokumentId }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          smartEditorCommentsApi.util.updateQueryData('getComments', { oppgaveId, dokumentId }, (draft) => [
            ...draft,
            data,
          ])
        );
      },
    }),
    postReply: builder.mutation<ISmartEditorComment, IPostReplyParams>({
      query: ({ oppgaveId, dokumentId, commentId, ...body }) => ({
        url: `${oppgaveId}/dokumenter/smarteditor/${dokumentId}/comments/${commentId}/replies`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ oppgaveId, dokumentId, commentId }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          smartEditorCommentsApi.util.updateQueryData('getComment', { oppgaveId, dokumentId, commentId }, (draft) => ({
            ...draft,
            comments: [...draft.comments, data],
          }))
        );
      },
    }),
  }),
});

export const { useGetCommentQuery, useGetCommentsQuery, usePostCommentMutation, usePostReplyMutation } =
  smartEditorCommentsApi;
