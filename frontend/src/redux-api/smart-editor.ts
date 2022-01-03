import { createApi } from '@reduxjs/toolkit/query/react';
import {
  IGetCommentParams,
  INewSmartEditor,
  ISmartEditor,
  ISmartEditorComment,
  ISmartEditorCommentReply,
  ISmartEditorCommentRequest,
  ISmartEditorRawResponse,
  ISmartEditorResponse,
} from '../types/smart-editor';
import { staggeredBaseQuery } from './common';

export const smartEditorApi = createApi({
  reducerPath: 'smartEditorApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getSmartEditor: builder.query<ISmartEditorResponse | null, string>({
      query: (documentId) => `/api/kabal-smart-editor-api/documents/${documentId}`,
      transformResponse: ({ id, created, modified, json }: ISmartEditorRawResponse) => ({
        id,
        created,
        modified,
        smartEditorData: JSON.parse(json) as ISmartEditor,
      }),
    }),
    createSmartEditor: builder.mutation<ISmartEditorResponse, INewSmartEditor>({
      query: (body) => ({
        url: '/api/kabal-smart-editor-api/documents/',
        method: 'POST',
        body,
      }),
      transformResponse: ({ id, created, modified, json }: ISmartEditorRawResponse) => ({
        id,
        created,
        modified,
        smartEditorData: JSON.parse(json) as ISmartEditor,
      }),
    }),
    updateSmartEditor: builder.mutation<ISmartEditorResponse, ISmartEditor>({
      query: ({ id, ...smartEditor }) => ({
        url: `/api/kabal-smart-editor-api/documents/${id}`,
        method: 'PUT',
        body: smartEditor,
      }),
      onQueryStarted: async (smartEditorData, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          smartEditorApi.util.updateQueryData('getSmartEditor', smartEditorData.id, (smartEditor) => {
            if (smartEditor !== null) {
              smartEditor.smartEditorData = smartEditorData;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            smartEditorApi.util.updateQueryData('getSmartEditor', smartEditorData.id, (smartEditor) => {
              if (smartEditor !== null) {
                smartEditor.modified = data.modified;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteSmartEditor: builder.mutation<null, string>({
      query: (id) => ({
        url: `/api/kabal-smart-editor-api/documents/${id}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(smartEditorApi.util.updateQueryData('getSmartEditor', id, () => null));

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      transformResponse: () => null,
    }),
    postComment: builder.mutation<ISmartEditorComment, ISmartEditorCommentRequest>({
      query: ({ documentId, ...body }) => ({
        url: `/api/kabal-smart-editor-api/documents/${documentId}/comments`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ documentId, ...body }, { dispatch, queryFulfilled }) => {
        const now = new Date().toISOString();

        const patchResult = dispatch(
          smartEditorApi.util.updateQueryData('getAllComments', documentId, (threads) => {
            const newComment = {
              comments: [],
              modified: now,
              id: now,
              created: now,
              documentId,
              ...body,
            };

            threads.push(newComment);
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            smartEditorApi.util.updateQueryData('getAllComments', documentId, (draft) =>
              draft.map((thread) => (thread.id === now ? data : thread))
            )
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    postCommentReply: builder.mutation<ISmartEditorComment, ISmartEditorCommentReply>({
      query: ({ documentId, threadId, ...body }) => ({
        url: `/api/kabal-smart-editor-api/documents/${documentId}/comments/${threadId}/replies`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ documentId, threadId, ...body }, { dispatch, queryFulfilled }) => {
        const now = new Date().toISOString();

        const patchResult = dispatch(
          smartEditorApi.util.updateQueryData('getAllComments', documentId, (threads) => {
            const newComment = {
              comments: [],
              modified: now,
              id: now,
              created: now,
              documentId,
              ...body,
            };

            const thread = threads.find(({ id }) => id === threadId);

            if (typeof thread !== 'undefined') {
              thread.comments.push(newComment);
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            smartEditorApi.util.updateQueryData('getAllComments', documentId, (draft) => {
              const thread = draft.find(({ id }) => id === threadId);

              if (typeof thread === 'undefined') {
                return;
              }

              thread.comments = thread.comments.map((c) => (c.id === now ? data : c));
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    getAllComments: builder.query<ISmartEditorComment[], string>({
      query: (documentId) => `/api/kabal-smart-editor-api/documents/${documentId}/comments`,
    }),
    getComment: builder.query<ISmartEditorComment, IGetCommentParams>({
      query: ({ documentId, commentId }) => `/api/kabal-smart-editor-api/documents/${documentId}/comments/${commentId}`,
    }),
  }),
});

export const {
  useGetSmartEditorQuery,
  useGetCommentQuery,
  useCreateSmartEditorMutation,
  usePostCommentMutation,
  useGetAllCommentsQuery,
  useUpdateSmartEditorMutation,
  useDeleteSmartEditorMutation,
  usePostCommentReplyMutation,
} = smartEditorApi;
